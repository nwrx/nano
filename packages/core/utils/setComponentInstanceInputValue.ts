import type { Thread } from '../thread'
import { getComponentInstance } from './getComponentInstance'

/**
 * Helper function to set an input value on a component instance.
 *
 * @param thread The thread where the component instance is located.
 * @param id The ID of the component instance.
 * @param name The name of the input to set.
 * @param value The value to set on the input key.
 */
export function setComponentInstanceInputValue(thread: Thread, id: string, name: string, value: unknown) {
  if (thread.isRunning) throw new Error('Cannot set input values on component instances while the thread is running.')
  const componentInstance = getComponentInstance(thread, id)
  componentInstance.input = componentInstance.input ?? {}
  componentInstance.input[name] = value
}
