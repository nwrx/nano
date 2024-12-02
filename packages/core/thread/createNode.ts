import type { ObjectLike } from '@unshared/types'
import type { Component, NodeContext } from '../module'
import type { NodeEventMeta, NodeEvents, NodeState, ThreadError } from '../utils'
import { Emitter } from '../utils'

export class Node extends Emitter<NodeEvents> {
  constructor(
    public readonly component: Component,
  ) {
    super()
  }

  startedAt = 0
  error: ThreadError | undefined
  data: ObjectLike = {}
  result: ObjectLike = {}
  internalState: NodeState = 'IDLE'
  abortController = new AbortController()

  /***************************************************************************/
  /* Helpers                                                                 */
  /***************************************************************************/

  private set state(state: NodeState) {
    this.internalState = state
    this.dispatch('state', this.eventMetadata)
  }

  public get state(): NodeState {
    return this.internalState
  }

  private get eventMetadata(): NodeEventMeta {
    return {
      nodeState: this.state,
      nodeDuration: Date.now() - this.startedAt,
    }
  }

  /***************************************************************************/
  /* Runtime                                                                 */
  /***************************************************************************/

  abort() {
    this.abortController.abort()
    this.abortController = new AbortController()
  }

  async process(data: ObjectLike = {}) {
    this.startedAt = Date.now()
    try {

      const context: NodeContext = {
        data,
        result: this.result,
        trace: data => this.dispatch('trace', data, this.eventMetadata),
        abortSignal: this.abortController.signal,
      }

      if (this.component.process) {
        this.state = 'PROCESSING'
        this.dispatch('start', context, this.eventMetadata)
        this.result = context.result = await this.component.process(context)
      }

      this.state = 'DONE'
      this.dispatch('end', context, this.eventMetadata)
      return this.result
    }
    catch (error) {
      this.error = error as ThreadError
      this.dispatch('error', error as ThreadError, this.eventMetadata)
      this.state = 'ERROR'
    }
  }
}

export function createNode(component: Component) {
  return new Node(component)
}
