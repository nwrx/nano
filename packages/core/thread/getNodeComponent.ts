import type { Thread } from './createThread'
import { resolveComponent } from '../utils'
import { getNode } from './getNode'

export async function getNodeComponent(thread: Thread, id: string) {
  const node = getNode(thread, id)
  if (node.component) return node.component
  node.component = await resolveComponent(node, thread.componentResolvers)
  return node.component
}
