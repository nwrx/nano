import type { Thread } from '../thread'

/**
 * Given a thread and a list of component instance IDs, remove the component
 * instances from the thread with the given IDs. Additionally, if the thread is
 * running, abort the nodes associated with the component instances.
 *
 * @param thread The thread where the component instances are located.
 * @param ids The IDs of the component instances to remove.
 */
export function removeComponentInstances(thread: Thread, ...ids: string[]): void {
  for (const id of ids) thread.componentInstances.delete(id)

  // --- If the thread is running, abort the nodes associated with the component instances.
  if (thread.isRunning) {
    for (const id of ids) {
      const node = thread.nodes.get(id)
      if (node) node.abort()
    }
  }
}
