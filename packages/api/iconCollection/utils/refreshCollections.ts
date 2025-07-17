import type { Loose } from '@unshared/types'
import type { IconCollection } from '../entities'
import type { ModuleIconCollection } from '../index'
import { createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { assertUser } from '../../user/utils/assertUser'
import { fetchCollectionsMetadata } from './fetchCollectionsMetadata'

export const UPDATE_COLLECTIONS_OPTIONS_SCHEMA = createParser({
  user: assertUser,
})

export type UpdateCollectionsOptions = Loose<ReturnType<typeof UPDATE_COLLECTIONS_OPTIONS_SCHEMA>>

/**
 * Collect all icon collections from the remote Iconify API and update the database.
 *
 * @param options The options for updating collections.
 * @returns An array of icon `IconCollection` objects.
 */
export async function refreshCollections(
  this: ModuleIconCollection,
  options: UpdateCollectionsOptions,
): Promise<IconCollection[]> {
  const moduleUser = this.getModule(ModuleUser)
  const { user } = UPDATE_COLLECTIONS_OPTIONS_SCHEMA(options)

  // --- Check if the user is a super administrator.
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_UNAUTHORIZED()

  // --- Get the remote and local collections.
  const { IconCollection } = this.getRepositories()
  const allCollections = await IconCollection.find()
  const remoteCollections = await fetchCollectionsMetadata.call(this)

  // --- Create or update collections in the database.
  for (const [name, metadata] of Object.entries(remoteCollections)) {
    let collection = allCollections.find(collection => collection.name === name)

    // --- If the collection does not exist, create a new one.
    if (!collection) {
      collection = IconCollection.create({ name, status: 'NotInstalled' })
      allCollections.push(collection)
    }

    // --- If the version is different and status is `Installed`, mark it as `Outdated`.
    if (collection.status === 'Installed' && collection.version !== metadata.version)
      collection.status = 'Outdated'

    // --- Update the collection with metadata.
    collection.title = metadata.name
    collection.metadata = metadata
    collection.version = metadata.version ?? '0.0.1'
    collection.updatedAt = new Date()
    collection.createdBy = user
    collection.updatedBy = user
  }

  // --- Save all collections to the database.
  await IconCollection.save(allCollections)
  return allCollections
}
