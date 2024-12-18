import { ERRORS as E } from './errors'

export interface SpecifierObject {
  tag: string
  registry: string
  collection: string
  name: string
}

/** The regular expression that is used to parse a component specifier. */
const EXP_COMPONENT_SPECIFIER = /^(((?<registry>[.a-z-]+):)?(?<collection>[a-z-]+)\/)?(?<name>[a-z-]+)(@(?<tag>[\da-z-]+))?$/

/**
 * The function that is used to parse a component specifier. The parse function
 * is used to parse the specifier into its module, name, and version.
 *
 * @param specifier The specifier of the component to parse.
 * @returns The parsed component specifier.
 * @example
 *
 * // Parse with version and provider.
 * parseSpecifier('provider:module/name@1') // { collection: 'module', version: '1', component: 'name' }
 *
 * // Parse with version.
 * parseSpecifier('module/name@1') // { collection: 'module', version: '1', component: 'name' }
 *
 * // Parse without version.
 * parseSpecifier('module/name') // { collection: 'module', version: 'latest', component: 'name' }
 *
 * // Parse with version and no module (Core module).
 * parseSpecifier('name') // { collection: 'core', version: 'latest', component: 'name' }
 */
export function parseSpecifier(specifier: string): SpecifierObject {
  const match = EXP_COMPONENT_SPECIFIER.exec(specifier)
  if (!match?.groups) throw E.COMPONENT_INVALID_SPECIFIER_FORMAT(specifier)
  const { registry = 'default', collection = 'core', tag = 'latest', name } = match.groups
  return { registry, collection, tag, name }
}
