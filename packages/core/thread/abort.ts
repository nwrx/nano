import type { Thread } from './createThread'
import { createEventMetadata } from '../utils'

/**
 * Aborts a thread and all its nodes.
 *
 * @param thread The thread to abort.
 */
export function abort(thread: Thread) {
  thread.abortController.abort()
  thread.dispatch('abort', createEventMetadata(thread))
  thread.abortController = new AbortController()
}
