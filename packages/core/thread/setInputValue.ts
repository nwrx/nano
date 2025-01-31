import type { Thread } from './createThread'
import { getInstance } from './getInstance'

/**
 * Helper function to set an input value on a component instance.
 *
 * @param thread The thread where the component instance is located.
 * @param id The ID of the component instance.
 * @param name The name of the input to set.
 * @param value The value to set on the input key.
 */
export function setInputValue(thread: Thread, id: string, name: string, value: unknown) {
  const componentInstance = getInstance(thread, id)
  componentInstance.input = componentInstance.input ?? {}
  componentInstance.input[name] = value
}
