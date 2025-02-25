import type { Loose } from '@unshared/types'
import type { RegistryCollection } from '../entities'
import type { ModuleRegistry } from '../index'
import { assert, createSchema } from '@unshared/validation'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'

const CREATE_REGISTRY_COLLECTION_OPTIONS = createSchema({
  workspace: assertWorkspace,
  user: assertUser,
  name: assert.stringNotEmpty,
  title: [[assert.undefined], [assert.stringNotEmpty]],
})

/** The options to create the registry collection with. */
export type CreateRegistryCollectionOptions = Loose<ReturnType<typeof CREATE_REGISTRY_COLLECTION_OPTIONS>>

/**
 * Create a new registry collection in the workspace with the given name and title.
 * The function will throw an error if the collection already exists in the workspace.
 *
 * @param options The options to create the collection with.
 * @returns The newly created `RegistryCollection` entity.
 */
export async function createRegistryCollection(this: ModuleRegistry, options: CreateRegistryCollectionOptions): Promise<RegistryCollection> {
  const { RegistryCollection } = this.getRepositories()
  const { name, title = name, workspace, user } = CREATE_REGISTRY_COLLECTION_OPTIONS(options)

  // --- Check if the collection already exists in the workspace.
  const exists = await RegistryCollection.countBy({ name, workspace })
  if (exists > 0) throw this.errors.REGISTRY_COLLECTION_NAME_TAKEN(workspace.name, name)

  // --- Create the registry collection.
  return RegistryCollection.create({ createdBy: user, name, title, workspace })
}
