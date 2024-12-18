import type { Thread } from './createThread'
import { getNode } from './getNode'

export function getNodeInputValue(thread: Thread, id: string, name: string): unknown {
  const node = getNode(thread, id)
  return node.input[name]
}
