import type { Node } from './addNode'
import type { Thread } from './createThread'
import { ERRORS as E } from '../utils'

export function getNode(thread: Thread, id: string): Node {
  const node = thread.nodes.get(id)
  if (!node) throw E.NODE_NOT_FOUND(id)
  return node
}
