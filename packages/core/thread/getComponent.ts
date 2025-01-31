import type { Thread } from './createThread'
import { resolveComponent } from '../utils/resolveComponent'
import { getInstance } from './getInstance'

export async function getComponent(thread: Thread, id: string) {
  const instance = getInstance(thread, id)
  if (instance.component) return instance.component
  instance.component = await resolveComponent(instance.specifier, thread.componentResolvers)
  return instance.component
}
