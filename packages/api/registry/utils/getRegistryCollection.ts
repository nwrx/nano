import type { Loose } from '@unshared/types'
import type { RegistryCollection } from '../entities'
import type { ModuleRegistry } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertWorkspace } from '../../workspace'

const GET_REGISTRY_COLLECTION_OPTIONS = createParser({
  workspace: assertWorkspace,
  name: assert.stringNotEmpty,
  withComponents: [[assert.undefined], [assert.boolean]],
  withCategories: [[assert.undefined], [assert.boolean]],
})

/** The options to retrieve the registry collection with. */
export type GetRegistryCollectionOptions = Loose<ReturnType<typeof GET_REGISTRY_COLLECTION_OPTIONS>>

/**
 * Get a registry collection by its name in the given workspace. If the user is provided,
 * the function will check if the user has access to the collection.
 *
 * @param options The options to find the registry collection with.
 * @returns The registry collection if found and accessible.
 * @throws {Error} If the collection is not found or the user doesn't have access.
 */
export async function getRegistryCollection(this: ModuleRegistry, options: GetRegistryCollectionOptions): Promise<RegistryCollection> {
  const { name, workspace, withComponents, withCategories } = GET_REGISTRY_COLLECTION_OPTIONS(options)
  const { RegistryCollection } = this.getRepositories()

  // --- Get the collection.
  const collection = await RegistryCollection.findOne({
    where: {
      name,
      workspace,
    },
    relations: {
      components: (withComponents || withCategories)
        ? { categories: withCategories }
        : false,
    },
  })

  // --- Return the collection if found.
  if (!collection) throw this.errors.REGISTRY_COLLECTION_NOT_FOUND(workspace?.name, name)
  return collection
}
