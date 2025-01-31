import type { ComponentInstance } from './add'
import type { Thread } from './createThread'

export function getInstance(thread: Thread, id: string): ComponentInstance {
  const componentInstance = thread.componentInstances.get(id)
  if (!componentInstance) throw new Error(`The node with ID "${id}" does not exist in the thread.`)
  return componentInstance
}
