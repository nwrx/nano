import type { Thread } from './createThread'
import { getInstance } from './getInstance'

export function getInputValue(thread: Thread, id: string, name: string): unknown {
  const componentInstance = getInstance(thread, id)
  return componentInstance.input?.[name]
}
