import type { Thread } from './createThread'
import { ERRORS as E } from '../utils'
import { getNodeComponent } from './getNodeComponent'

export async function getNodeOutputSocket(thread: Thread, id: string, name: string) {
  const component = await getNodeComponent(thread, id)
  const socket = component.outputs?.[name]
  if (!socket) throw E.NODE_OUTPUT_SOCKET_NOT_FOUND(id, name)
  return socket
}
