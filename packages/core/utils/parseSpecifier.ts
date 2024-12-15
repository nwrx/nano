export interface ComponentSpecifier {
  providerName?: string
  moduleName: string
  moduleVersion: string
  componentName: string
}

/** The regular expression that is used to parse a component specifier. */
const EXP_COMPONENT_SPECIFIER = /^(((?<providerName>[.a-z-]+):)?(?<moduleName>\w+)(@(?<moduleVersion>\w+))?\/)?(?<componentName>\w+)$/

/**
 * The function that is used to parse a component specifier. The parse function
 * is used to parse the specifier into its module, name, and version.
 *
 * @param specifier The specifier of the component to parse.
 * @returns The parsed component specifier.
 * @example
 *
 * // Parse with version and provider.
 * parseSpecifier('provider:module/name@1') // { providerName: 'provider', moduleName: 'module', moduleVersion: '1', componentName: 'name' }
 *
 * // Parse with version.
 * parseSpecifier('module/name@1') // { moduleName: 'module', moduleVersion: '1', componentName: 'name' }
 *
 * // Parse without version.
 * parseSpecifier('module/name') // { moduleName: 'module', moduleVersion: 'latest', componentName: 'name' }
 *
 * // Parse with version and no module (Core module).
 * parseSpecifier('name') // { moduleName: 'core', moduleVersion: 'latest', componentName: 'name' }
 */
export function parseSpecifier(specifier: string): ComponentSpecifier {
  const match = EXP_COMPONENT_SPECIFIER.exec(specifier)
  if (!match?.groups) throw new Error(`The component specifier "${specifier}" is invalid.`)
  const { providerName, moduleName = 'core', moduleVersion = 'latest', componentName } = match.groups
  return { providerName, moduleName, moduleVersion, componentName }
}
