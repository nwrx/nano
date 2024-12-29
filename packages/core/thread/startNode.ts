import type { ObjectLike } from '@unshared/types'
import type { Thread } from './createThread'
import { processInSandbox } from '../sandbox'
import { getNode } from './getNode'
import { getNodeComponent } from './getNodeComponent'
import { getNodeData } from './getNodeData'

export async function startNode(thread: Thread, nodeId: string, data?: ObjectLike): Promise<ObjectLike> {
  const node = getNode(thread, nodeId)
  try {
    node.startedAt = Date.now()
    node.state = 'starting'
    thread.dispatch('nodeState', nodeId, node.state)
    const component = await getNodeComponent(thread, nodeId)

    // --- Process the node if it has a process method.
    if (component.process) {
      const context = { data: data ?? await getNodeData(thread, nodeId), nodeId, thread }
      node.state = 'processing'
      thread.dispatch('nodeState', nodeId, node.state)
      thread.dispatch('nodeStart', nodeId, context.data)
      node.result = component.isTrusted
        ? await component.process(context)
        : await processInSandbox(thread, nodeId, context.data)
    }

    node.state = 'done'
    thread.dispatch('nodeState', nodeId, node.state)
    thread.dispatch('nodeDone', nodeId, node.result)
    return node.result
  }
  catch (error) {
    node.error = error as Error
    thread.dispatch('nodeError', nodeId, error as Error)
    node.state = 'error'
    thread.dispatch('nodeState', nodeId, node.state)
    throw error
  }
}
