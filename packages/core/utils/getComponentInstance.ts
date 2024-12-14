import type { Thread } from '../createThread'
import type { ComponentInstance } from './addComponentInstance'

/**
 * Get a component instance by its ID.
 *
 * @param thread The thread where the component instance is located.
 * @param id The ID of the component instance to get.
 * @returns The component instance with the given ID.
 * @example getComponentInstance(thread, 'node-1') // { id: 'node-1', ... }
 */
export function getComponentInstance(thread: Thread, id: string): ComponentInstance {
  const componentInstance = thread.componentInstances.get(id)
  if (!componentInstance) throw new Error(`The node with ID "${id}" does not exist in the thread.`)
  return componentInstance
}
