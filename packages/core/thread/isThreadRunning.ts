import type { Thread } from './createThread'

/**
 * Check if a thread is running by checking if at least one of the component instances is
 * still not done. If at least one of the component instances is still not done, then the
 * thread is still running.
 *
 * @param thread The thread to check.
 * @returns Returns `true` if the thread is still running, otherwise `false`.
 */
export function isThreadRunning(thread: Thread): boolean {
  for (const [,instance] of thread.nodes)
    if (instance.state === 'processing') return true
  return false
}
