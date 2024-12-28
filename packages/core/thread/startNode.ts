import type { ObjectLike } from '@unshared/types'
import type { Thread } from './createThread'
import { processInSandbox } from '../sandbox'
import { createEventMetadata } from '../utils'
import { getNode } from './getNode'
import { getNodeComponent } from './getNodeComponent'
import { getNodeData } from './getNodeData'

export async function startNode(thread: Thread, nodeId: string, data?: ObjectLike): Promise<ObjectLike> {
  const node = getNode(thread, nodeId)
  try {
    node.startedAt = Date.now()
    node.state = 'starting'
    thread.dispatch('nodeState', nodeId, createEventMetadata(thread, nodeId))
    const component = await getNodeComponent(thread, nodeId)

    // --- Process the node if it has a process method.
    if (component.process) {
      node.state = 'processing'
      const context = component.isTrusted
        ? { data: data ?? await getNodeData(thread, nodeId), nodeId, thread }
        : { data: data ?? await getNodeData(thread, nodeId) }
      thread.dispatch('nodeState', nodeId, createEventMetadata(thread, nodeId))
      thread.dispatch('nodeStart', nodeId, context.data, createEventMetadata(thread, nodeId))
      node.result = component.isTrusted
        ? await component.process(context)
        : await processInSandbox(thread, nodeId, context)
    }

    node.state = 'done'
    thread.dispatch('nodeState', nodeId, createEventMetadata(thread, nodeId))
    thread.dispatch('nodeDone', nodeId, { ...node.result }, createEventMetadata(thread, nodeId))
    return node.result
  }
  catch (error) {
    node.error = error as Error
    node.state = 'error'
    thread.dispatch('nodeState', nodeId, createEventMetadata(thread, nodeId))
    thread.dispatch('nodeError', nodeId, error as Error, createEventMetadata(thread, nodeId))
    throw error
  }
}
