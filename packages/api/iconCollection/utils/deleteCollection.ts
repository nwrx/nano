import type { Loose } from '@unshared/types'
import type { ModuleIconCollection } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ModuleIcon } from '../../icon'
import { ModuleStorage } from '../../storage'
import { ModuleUser } from '../../user'
import { assertUser } from '../../user/utils/assertUser'
import { getCollection } from './getCollection'

const DELETE_COLLECTION_OPTIONS_SCHEMA = createParser({
  name: assert.stringNotEmpty,
  user: assertUser,
})

export type DeleteCollectionOptions = Loose<ReturnType<typeof DELETE_COLLECTION_OPTIONS_SCHEMA>>

/**
 * Deletes an icon collection by its name.
 * Only superadmins can delete collections.
 *
 * @param options The options for deleting the collection.
 * @returns The deleted collection entity.
 */
export async function deleteCollection(this: ModuleIconCollection, options: DeleteCollectionOptions): Promise<void> {
  const moduleUser = this.getModule(ModuleUser)
  const moduleIcon = this.getModule(ModuleIcon)
  const moduleStorage = this.getModule(ModuleStorage)
  const { name, user } = DELETE_COLLECTION_OPTIONS_SCHEMA(options)

  // --- Check if the user is a super administrator.
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_UNAUTHORIZED()

  // --- Get the collection to delete.
  const collection = await getCollection.call(this, { name, user, withFile: true, withIcons: true })

  // --- Delete each file in the icon collection.
  const { Icon } = moduleIcon.getRepositories()
  for (const icon of collection.icons) {
    if (icon.file) await moduleStorage.erase(icon.file)
    await Icon.remove(icon)
  }

  // --- Delete the collection itself.
  const { IconCollection } = this.getRepositories()
  await IconCollection.remove(collection)
}
