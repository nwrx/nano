import { ERRORS as E } from './errors'

export interface SpecifierObject {
  registry: string
  workspace: string
  collection: string
  name: string
  tag: string
}

/**
 * Parse a component specifier into its parts. The specifier should be in the format
 * of `registry:workspace/collection/component@tag`. Note that all parts are optional
 * except for the name.
 *
 * @param specifier The serialized specifier to parse.
 * @returns The parsed specifier object.
 * @example parseSpecifier('example.com:workspace/collection/component@1.0.0')
 * // {
 * //   registry: 'example.com',
 * //   workspace: 'workspace',
 * //   collection: 'collection',
 * //   name: 'component',
 * //   tag: '1.0.0',
 * // }
 */
export function parseSpecifier(specifier: string): SpecifierObject {
  let registry = 'default'
  let workspace = 'default'
  let collection = 'default'
  let tag = 'latest'
  let name: string | undefined

  // --- Split by @ to separate tag
  const [mainPart, tagPart] = specifier.split('@')
  if (tagPart) tag = tagPart

  // --- Handle registry and remaining parts based on the number of colons.
  // --- 3 -> registry:workspace/collection/name
  // --- 2 -> registry:collection/name
  // --- 1 -> registry:name
  const registryParts = mainPart.split(':')
  if (registryParts.length > 1) {
    registry = registryParts[0]
    const pathParts = registryParts[1].split('/')
    if (pathParts.length === 3) [workspace, collection, name] = pathParts
    else if (pathParts.length === 2) [collection, name] = pathParts
    else if (pathParts.length === 1) name = pathParts[0]
  }

  // --- If no registry is provided, handle the remaining parts.
  // --- 3 -> workspace/collection/name
  // --- 2 -> collection/name
  // --- 1 -> name
  else {
    const pathParts = mainPart.split('/')
    if (pathParts.length === 3) [workspace, collection, name] = pathParts
    else if (pathParts.length === 2) [collection, name] = pathParts
    else name = mainPart
  }

  // --- Return the parsed specifier object if the name is valid.
  if (!name) throw E.COMPONENT_INVALID_SPECIFIER_FORMAT(specifier)
  return { registry, workspace, collection, tag, name }
}
