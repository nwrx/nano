import type { Thread } from '../thread'
import { getComponentInstance } from './getComponentInstance'

/**
 * Helper function to set a meta value on a component instance.
 *
 * @param thread The thread where the component instance is located.
 * @param id The ID of the component instance.
 * @param name The name of the meta value to set.
 * @param value The value to set on the meta key.
 */
export function setComponentInstanceMetaValue(thread: Thread, id: string, name: string, value: unknown) {
  if (thread.isRunning) throw new Error('Cannot set meta values on component instances while the thread is running.')
  const componentInstance = getComponentInstance(thread, id)
  componentInstance.meta = componentInstance.meta ?? {}
  componentInstance.meta[name] = value
}
