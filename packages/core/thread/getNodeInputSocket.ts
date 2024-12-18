import type { Thread } from './createThread'
import { ERRORS as E } from '../utils'
import { getNodeComponent } from './getNodeComponent'

export async function getNodeInputSocket(thread: Thread, id: string, name: string) {
  const component = await getNodeComponent(thread, id)
  const socket = component.inputs?.[name]
  if (!socket) throw E.NODE_SOCKET_NOT_FOUND(id, name)
  return socket
}
