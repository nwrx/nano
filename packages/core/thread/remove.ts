import type { Thread } from './createThread'
import type { RemoveLinkResult } from './removeLink'
import { getLinks } from './getLinks'
import { removeLink } from './removeLink'

/**
 * Given a thread and a list of component instance IDs, remove the component
 * instances from the thread with the given IDs. Additionally, if the thread is
 * running, abort the nodes associated with the component instances.
 *
 * @param thread The thread where the component instances are located.
 * @param ids The IDs of the component instances to remove.
 * @returns A promise that resolves with the results of the removed links.
 */
export async function remove(thread: Thread, ...ids: string[]): Promise<RemoveLinkResult[]> {
  const links = getLinks(thread)
  const promises: Array<Promise<RemoveLinkResult[]>> = []
  for (const id of ids) {

    // --- Remove the links that are connected to the node.
    for (const link of links) {
      if (link.sourceId !== id) continue
      const promise = removeLink(thread, { sourceId: id })
      promises.push(promise)
    }

    // --- Remove the component instance from the thread.
    thread.componentInstances.delete(id)
  }

  // --- Wait for all the links to be removed.
  return Promise.all(promises).then(results => results.flat())
}
