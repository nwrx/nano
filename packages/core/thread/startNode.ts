import type { ProcessContext } from '../utils'
import type { Thread } from './createThread'
import { processInSandbox } from '../sandbox/processInSandbox'
import { createEventMetadata } from './createEventMetadata'
import { getNode } from './getNode'
import { getNodeComponent } from './getNodeComponent'
import { getNodeData } from './getNodeData'

export async function startNode(thread: Thread, id: string) {
  const node = getNode(thread, id)
  const component = await getNodeComponent(thread, id)
  try {
    node.startedAt = Date.now()
    node.state = 'processing'
    thread.dispatch('nodeState', id, node, createEventMetadata(thread, node))

    // --- Resolve the data by parsing the input based on the schema. Additionally, we
    // --- will resolve the references in the data by calling the reference resolvers.
    const context: ProcessContext = {
      data: await getNodeData(thread, id),
      trace: payload => thread.dispatch('nodeTrace', id, node, payload, createEventMetadata(thread, node)),
    }

    if (component.process) {
      thread.dispatch('nodeStart', id, node, context.data, createEventMetadata(thread, node))
      node.result = node.isSandboxed
        ? await processInSandbox(component.process, { ...context, abortSignal: thread.abortController.signal })
        : await component.process(context)
    }

    node.state = 'done'
    thread.dispatch('nodeState', id, node, createEventMetadata(thread, node))
    thread.dispatch('nodeDone', id, node, node.result, createEventMetadata(thread, node))
    return node.result
  }
  catch (error) {
    node.error = error as Error
    node.state = 'error'
    thread.dispatch('nodeState', id, node, createEventMetadata(thread, node))
    thread.dispatch('nodeError', id, node, error as Error, createEventMetadata(thread, node))
    throw error
  }
}
