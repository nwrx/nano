import type { ObjectLike } from '@unshared/types'
import type { FlowNodeContext } from '../module'
import type { FlowError, FlowNode, FlowThreadNodeEventMeta, FlowThreadNodeEvents, FlowThreadNodeState } from '../utils'
import type { FlowThread } from './createFlowThread'
import { randomUUID } from 'node:crypto'
import { Emitter, resolveSchema } from '../utils'

export class FlowThreadNode extends Emitter<FlowThreadNodeEvents> {
  constructor(public readonly thread: FlowThread, public readonly node: FlowNode) {
    super()
  }

  id = randomUUID() as string
  startedAt = 0
  state: FlowThreadNodeState = 'IDLE'
  error: FlowError | undefined
  input: ObjectLike = {}
  output: ObjectLike = {}

  /***************************************************************************/
  /* Helpers                                                                 */
  /***************************************************************************/

  private get eventMetadata(): FlowThreadNodeEventMeta {
    return {
      threadId: this.thread.id,
      state: this.state,
      timestamp: Date.now(),
      duration: Date.now() - this.startedAt,
      delta: Date.now() - this.thread.startedAt,
    }
  }

  private setState(state: FlowThreadNodeState) {
    this.state = state
    this.dispatch('state', this.eventMetadata)
  }

  /***************************************************************************/
  /* Runtime                                                                 */
  /***************************************************************************/

  reset() {
    this.state = 'IDLE'
    this.error = undefined
    this.input = {}
    this.output = {}
  }

  async process() {
    try {
      this.setState('RUNNING/RESOLVING_DEFINITION')
      const definition = await this.thread.flow.describe(this.node.kind)
      let output: ObjectLike = {}

      // --- Resolve references and parse using the input schema.
      this.setState('RUNNING/RESOLVING_INPUT')
      this.input = await resolveSchema(
        this.node.input ?? {},
        definition.inputSchema ?? {},
        this.thread.flow.options.resolveReference ?? [],
      )

      const context: FlowNodeContext = {
        input: this.input,
        output: this.output,
        abortSignal: this.thread.abortController.signal,
      }

      // --- Process the node by calling the process function of the node.
      if (definition.process) {
        this.setState('RUNNING/PROCESSING')
        this.dispatch('start', context, this.eventMetadata)
        output = await definition.process(context)
      }

      // --- Resolve the output and parse using the output schema.
      this.setState('RUNNING/RESOLVING_OUTPUT')
      this.output = await resolveSchema(output, definition.outputSchema ?? {} )

      // --- Set the state of the node to done.
      context.output = this.output
      this.setState('DONE')
      this.dispatch('end', context, this.eventMetadata)
      return this.output
    }
    catch (error) {
      this.error = error as FlowError
      this.setState('ERROR')
      this.dispatch('error', error as FlowError, this.eventMetadata)
    }
  }
}
