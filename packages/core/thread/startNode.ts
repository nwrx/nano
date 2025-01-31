import type { ObjectLike } from '@unshared/types'
import type { Thread } from './createThread'
import { processInSandbox } from '../sandbox'
import { createEventMetadata } from '../utils'
import { getNode } from './getNode'
import { getNodeComponent } from './getNodeComponent'
import { getNodeData } from './getNodeData'

export async function startNode(thread: Thread, nodeId: string, data?: ObjectLike): Promise<ObjectLike> {
  const node = getNode(thread, nodeId)
  const component = await getNodeComponent(thread, nodeId)
  try {
    node.startedAt = Date.now()
    node.state = 'starting'
    thread.dispatch('nodeState', nodeId, createEventMetadata(thread, node))

    // --- Process the node if it has a process method.
    if (component.process) {
      node.state = 'processing'
      const context = component.isTrusted
        ? { data: data ?? await getNodeData(thread, nodeId), nodeId, thread }
        : { data: data ?? await getNodeData(thread, nodeId) }
      thread.dispatch('nodeState', nodeId, createEventMetadata(thread, node))
      thread.dispatch('nodeStart', nodeId, context.data, createEventMetadata(thread, node))
      node.result = component.isTrusted
        ? await component.process(context)
        : await processInSandbox(component.process, context)
    }

    node.state = 'done'
    thread.dispatch('nodeState', nodeId, createEventMetadata(thread, node))
    thread.dispatch('nodeDone', nodeId, node.result, createEventMetadata(thread, node))
    return node.result
  }
  catch (error) {
    node.error = error as Error
    node.state = 'error'
    thread.dispatch('nodeState', nodeId, createEventMetadata(thread, node))
    thread.dispatch('nodeError', nodeId, error as Error, createEventMetadata(thread, node))
    throw error
  }
}
