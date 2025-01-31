import type { Thread } from './createThread'
import { getComponent } from './getComponent'

export async function getInputSocket(thread: Thread, id: string, name: string) {
  const component = await getComponent(thread, id)
  const socket = component.inputs?.[name]
  if (!socket) throw new Error(`The input socket "${name}" does not exist on node "${id}"`)
  return socket
}
