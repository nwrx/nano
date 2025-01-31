import type { Thread } from '../createThread'
import { getComponentInstance } from './getComponentInstance'

/**
 * Helper function to set a meta value on a component instance.
 *
 * @param thread The thread where the component instance is located.
 * @param id The ID of the component instance.
 * @param name The name of the meta value to set.
 * @param value The value to set on the meta key.
 */
export function setComponentInstanceMetadataValue(thread: Thread, id: string, name: string, value: unknown) {
  const componentInstance = getComponentInstance(thread, id)
  componentInstance.metadata = componentInstance.metadata ?? {}
  componentInstance.metadata[name] = value
}
