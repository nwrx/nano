import type { Loose } from '@unshared/types'
import type { RegistryComponent } from '../entities'
import type { ModuleRegistry } from '../index'
import { parseSpecifier } from '@nwrx/nano/utils'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getRegistryCollection } from './getRegistryCollection'
import { getRegistryComponent } from './getRegistryComponent'

const RESOLVE_COMPONENT_OPTIONS = createParser({
  user: [[assert.undefined], [assertUser]],
  specifier: assert.stringNotEmpty,
})

/** The options to retrieve the registry component with. */
export type ResolveComponentOptions = Loose<ReturnType<typeof RESOLVE_COMPONENT_OPTIONS>>

/**
 * Resolve a registry component by its serialized specifier. This will parse the specifier
 * and find the component in the given collection. If the component is not found or the user
 * doesn't have access to it, the function will throw an error.
 *
 * @param options The options to find the registry component with.
 * @returns The registry component if found and accessible.
 * @example
 * resolveComponent.call(registry, {
 *   specifier: 'workspace/collection/component@version',
 *   user: user,
 * })
 * // {
 * //   name: 'component',
 * //   version: 'version',
 * //   workspace: { name: 'workspace' },
 * //   collection: { name: 'collection' },
 * // }
 */
export async function resolveComponent(this: ModuleRegistry, options: ResolveComponentOptions): Promise<RegistryComponent> {
  const moduleWorkspace = this.getModule(ModuleWorkspace)
  const { user, specifier } = RESOLVE_COMPONENT_OPTIONS(options)
  const specifierObject = parseSpecifier(specifier)

  // --- Dirty replace the default workspace and collection to ones that exists.
  if (specifierObject.workspace === 'default') specifierObject.workspace = 'nanoworks'
  if (specifierObject.collection === 'default') specifierObject.collection = 'core'

  // --- Get the workspace and collection.
  const workspace = await moduleWorkspace.getWorkspace({ name: specifierObject.workspace, user, permission: 'Read' })
  const collection = await getRegistryCollection.call(this, { workspace, name: specifierObject.collection })
  const component = await getRegistryComponent.call(this, {
    workspace,
    collection,
    name: specifierObject.name,
    version: specifierObject.tag,
    withWorkspace: true,
    withCollection: true,
    withCategories: true,
  })

  // --- Return the component if found.
  return component
}
