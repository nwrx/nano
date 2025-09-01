import type { IconifyJSONIconsData } from '@iconify/types'
import type { Loose } from '@unshared/types'
import type { IconCollection } from '../entities'
import type { ModuleIconCollection } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ModuleIcon } from '../../icon'
import { ModuleStorage } from '../../storage'
import { assertUser } from '../../user'

export const INSTALL_COLLECTION_ICON_OPTIONS_SCHEMA = createParser({
  name: assert.stringNotEmpty,
  user: assertUser,
  data: assert.object as (v: unknown) => asserts v is IconifyJSONIconsData,
  collection: assert.object as (v: unknown) => asserts v is IconCollection,
})

export type InstallCollectionIconOptions =
  Loose<ReturnType<typeof INSTALL_COLLECTION_ICON_OPTIONS_SCHEMA>>

/**
 * Installs an icon from a collection into the database.
 * This function uploads the icon data to the storage and creates an icon entity.
 *
 * @param options The options for installing the icon.
 * @returns The created icon entity.
 */
export async function installCollectionIcon(this: ModuleIconCollection, options: InstallCollectionIconOptions): Promise<void> {
  const { name, user, data, collection } = INSTALL_COLLECTION_ICON_OPTIONS_SCHEMA(options)
  const moduleIcon = this.getModule(ModuleIcon)
  const moduleStorage = this.getModule(ModuleStorage)

  // --- Prepare the icon data and upload it to the storage.
  const iconName = `${collection.name}:${name}`
  const isSample = collection.metadata.samples?.includes(name)
  const iconBody = data.icons[name].body
  const iconData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${data.width} ${data.height}">${iconBody}</svg>`
  const iconFile = new File([iconData], `${iconName}.svg`, { type: 'image/svg+xml' })

  // --- Upload the icon file to the storage.
  const storageFile = await moduleStorage.upload({
    pool: await moduleStorage.getPublicPool(),
    file: iconFile,
    user,
  })

  // --- Create the icon entity and save it to the database.
  const { Icon } = moduleIcon.getRepositories()
  const icon = Icon.create({ name: iconName, file: storageFile, isSample, collection })
  await Icon.upsert(icon, { conflictPaths: ['name'] })
}
