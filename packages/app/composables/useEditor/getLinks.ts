/* eslint-disable sonarjs/cognitive-complexity */
import type { Link } from '@nwrx/nano'
import type { FlowNodeObject } from '@nwrx/nano-api'
import { isReferenceLink } from './isReferenceLink'
import { parseLink } from './parseLink'

export function getLinks(nodes: FlowNodeObject[]): Link[] {
  const links: Link[] = []
  for (const { id: targetId, input } of nodes) {
    for (const targetName in input) {
      const value = input[targetName]

      // --- If the value is an array, iterate over each value and add the links.
      if (Array.isArray(value)) {
        for (const x of value) {
          if (!isReferenceLink(x)) continue
          const parsedLink = parseLink(x)
          if (!parsedLink) continue
          links.push({ ...parsedLink, targetId, targetName })
        }
      }

      // --- If the value is an object, iterate over each value and add the links.
      else if (typeof value === 'object' && value !== null && !isReferenceLink(value)) {
        for (const targetPath in value) {
          const x = (value as Record<string, unknown>)[targetPath]
          if (!isReferenceLink(x)) continue
          const parsedLink = parseLink(x)
          if (!parsedLink) continue
          links.push({ ...parsedLink, targetId, targetName, targetPath })
        }
      }

      // --- Otherwise, add the link if the value is a link.
      else if (isReferenceLink(value)) {
        const parsedLink = parseLink(value)
        if (!parsedLink) continue
        links.push({ ...parsedLink, targetId, targetName })
      }
    }
  }

  // --- Assert that each link is valid.
  for (const link of links) {
    const sourceExists = nodes.some(node => node.id === link.sourceId)
    if (!sourceExists) links.splice(links.indexOf(link), 1)
  }

  // --- Return the links collected so far.
  return links
}
