import type { Thread } from '../createThread'
import { getComponentInstance } from './getComponentInstance'
import { resolveComponent } from './resolveComponent'

/**
 * Resolve the input socket of a component instance by its id and name. This function
 * will resolve the component of the instance and check if the socket exists.
 *
 * @param thread The thread where the component instance is located.
 * @param id The id of the component instance.
 * @param name The name of the socket to resolve.
 * @returns The socket of the component instance.
 * @example resolveInputSocket(thread, 'node-1', 'input', 'input') // => { type: 'string' }
 */
export async function resolveInputSocket(thread: Thread, id: string, name: string) {
  const instance = getComponentInstance(thread, id)
  const component = await resolveComponent(instance.specifier, thread.componentResolvers)
  const socket = component.inputs?.[name]
  if (!socket) throw new Error(`The input socket "${name}" does not exist on node "${id}"`)
  return socket
}
