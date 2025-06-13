import type { Loose } from '@unshared/types'
import type { RegistryComponent } from '../entities'
import type { ModuleRegistry } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertWorkspace } from '../../workspace'
import { assertRegistryCollection } from './assertRegistryCollection'

const GET_REGISTRY_COMPONENT_OPTIONS = createParser({
  workspace: assertWorkspace,
  collection: assertRegistryCollection,
  name: assert.stringNotEmpty,
  version: [[assert.undefined], [assert.stringNotEmpty]],
  withWorkspace: [[assert.undefined], [assert.boolean]],
  withCollection: [[assert.undefined], [assert.boolean]],
  withCategories: [[assert.undefined], [assert.boolean]],
})

/** The options to retrieve the registry component with. */
export type GetRegistryComponentOptions = Loose<ReturnType<typeof GET_REGISTRY_COMPONENT_OPTIONS>>

/**
 * Get a registry component by its name in the given collection. If the component is not
 * found or the user doesn't have access to it, the function will throw an error.
 *
 * @param options The options to find the registry component with.
 * @returns The registry component if found and accessible.
 * @throws {Error} If the component is not found or the user doesn't have access.
 */
export async function getRegistryComponent(this: ModuleRegistry, options: GetRegistryComponentOptions): Promise<RegistryComponent> {
  const {
    name,
    version,
    workspace,
    collection,
    withCategories,
    withCollection,
    withWorkspace,
  } = GET_REGISTRY_COMPONENT_OPTIONS(options)

  // --- Get the component.
  const { RegistryComponent } = this.getRepositories()
  const component = await RegistryComponent.findOne({
    where: {
      name,
      version: version === 'latest' ? undefined : version,
      collection,
    },
    order: {
      createdAt: 'DESC',
    },
    relations: {
      categories: withCategories,
      collection: (withCollection || withWorkspace)
        ? { workspace: withWorkspace }
        : false,
    },
  })

  // --- Return the component if found.
  if (!component) throw this.errors.REGISTRY_COMPONENT_NOT_FOUND(workspace.name, collection.name, name)
  return component
}
