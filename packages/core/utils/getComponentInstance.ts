import type { Thread } from '../thread'
import type { ComponentInstance } from './types'

export function getComponentInstance(thread: Thread, id: string): ComponentInstance {
  const componentInstance = thread.componentInstances.get(id)
  if (!componentInstance) throw new Error(`The node with ID "${id}" does not exist in the thread.`)
  return componentInstance
}
