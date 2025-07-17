import type { IconifyJSONIconsData } from '@iconify/types'
import type { Loose } from '@unshared/types'
import type { IconCollection } from '../entities'
import type { ModuleIconCollection } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ModuleIcon } from '../../icon'
import { ModuleStorage } from '../../storage'

export const INSTALL_COLLECTION_ICON_OPTIONS_SCHEMA = createParser({
  name: assert.stringNotEmpty,
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
  const moduleIcon = this.getModule(ModuleIcon)
  const moduleStorage = this.getModule(ModuleStorage)
  const { name, data, collection } = INSTALL_COLLECTION_ICON_OPTIONS_SCHEMA(options)

  // --- Prepare the icon data and upload it to the storage.
  const iconName = `${collection.name}:${name}`
  const isSample = collection.metadata.samples?.includes(name)
  const iconBody = data.icons[name].body
  const iconData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${data.width} ${data.height}">${iconBody}</svg>`
  const iconFile = await moduleStorage.upload({
    data: iconData,
    name: `${iconName}.svg`,
    type: 'image/svg+xml',
    pool: 'Default',
    size: iconData.length,
  })

  // --- Create the icon entity and save it to the database.
  const { Icon } = moduleIcon.getRepositories()
  const icon = Icon.create({ name: iconName, file: iconFile, isSample, collection })
  await Icon.save(icon)
}
