import type { ObjectLike } from '@unshared/types'
import type { FlowThreadEventMeta, FlowThreadEvents } from '../utils'
import type { Flow } from './createFlow'
import { randomUUID } from 'node:crypto'
import { Emitter } from '../utils'
import { FlowThreadNode } from './createFlowThreadNode'

export const NODE_INPUT_KIND = 'core/input'
export const NODE_OUTPUT_KIND = 'core/output'

export class FlowThread extends Emitter<FlowThreadEvents> {
  constructor(public flow: Flow) { super() }

  /** The unique identifier of the flow thread. */
  readonly id = randomUUID() as string

  /** The time when the flow thread was started. */
  startedAt = 0

  /** The nodes that are currently running in the flow thread. */
  nodes = new Map<string, FlowThreadNode>()

  /** The abort controller that is used to abort the flow thread. */
  abortController = new AbortController()

  /***************************************************************************/
  /* Helpers                                                                 */
  /***************************************************************************/

  private get eventMetadata(): FlowThreadEventMeta {
    return {
      threadId: this.id,
      timestamp: Date.now(),
      delta: Date.now() - this.startedAt,
    }
  }

  private areIncomingNodesDone(id: string) {
    const links = this.flow.getLinks()
    const incomingLinks = links.filter(link => link.targetId === id)
    for (const link of incomingLinks) {
      const sourceNode = this.nodes.get(link.sourceId)
      if (!sourceNode) return false
      if (sourceNode.state !== 'DONE') return false
    }
    return true
  }

  public get isRunning() {
    for (const node of this.nodes.values()) {
      const isNodeRunning = node.state.startsWith('RUNNING/')
      if (isNodeRunning) return true
    }
    return false
  }

  /***************************************************************************/
  /* Runtime                                                                 */
  /***************************************************************************/

  /** Aborts the flow thread. */
  abort() {
    this.abortController.abort()
    this.dispatch('abort', this.eventMetadata)
    this.abortController = new AbortController()
  }

  async start(threadInput: ObjectLike = {}) {
    const threadOutput: ObjectLike = {}
    const links = this.flow.getLinks()

    this.nodes.clear()
    this.startedAt = Date.now()
    this.dispatch('start', threadInput, this.eventMetadata)

    return new Promise<ObjectLike>((resolve) => {
      for (const node of this.flow.nodes) {
        const threadNode = new FlowThreadNode(this, node)
        this.nodes.set(node.id, threadNode)
        threadNode.on('state', meta => this.dispatch('nodeState', threadNode, meta))

        // --- If the node is an input, apply the input value to the thread input.
        threadNode.on('start', (context, meta) => {
          this.dispatch('nodeStart', threadNode, context, meta)
          const { input, output } = context
          if (node.kind === NODE_INPUT_KIND) {
            const name = input.name as string
            output.value = threadInput[name]
          }
        })

        // --- Dispatch the node error event if the node emits an error.
        threadNode.on('error', (error, meta) => {
          this.dispatch('nodeError', threadNode, error, meta)
          if (this.isRunning) return
          this.dispatch('end', threadOutput, this.eventMetadata)
          return resolve(threadOutput)
        })

        // --- If the node is an output, we collect this specific output value and it's corresponding name
        // --- and apply it to the thread output. We also dispatch the output event with the name and value.
        threadNode.on('end', (context, meta) => {
          this.dispatch('nodeEnd', threadNode, context, meta)

          // --- If the node is an output, apply the output value to the thread output.
          const { input, output } = context
          if (node.kind === NODE_OUTPUT_KIND) {
            const name = input.name as string
            const value = output.value
            threadOutput[name] = value
            this.dispatch('output', name, value, this.eventMetadata)
          }

          // --- If the node has outgoing links, start the next nodes
          // --- if all their incoming nodes are done.
          const outgoingLinks = links.filter(link => link.sourceId === node.id)
          for (const link of outgoingLinks) {
            const targetNode = this.nodes.get(link.targetId)
            if (!targetNode) continue
            if (!this.areIncomingNodesDone(link.targetId)) continue
            void targetNode.process()
          }

          // --- If all the nodes are done, dispatch the end event.
          if (this.isRunning) return
          this.dispatch('end', threadOutput, this.eventMetadata)
          return resolve(threadOutput)
        })

        // --- If the node has no incoming links, start the node immediately.
        const hasIncomingLinks = links.some(link => link.targetId === node.id)
        if (!hasIncomingLinks) void threadNode.process()
      }
    })
  }
}
