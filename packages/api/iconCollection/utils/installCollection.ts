import type { Loose } from '@unshared/types'
import type { ModuleIconCollection } from '../index'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { assertUser } from '../../user/utils/assertUser'
import { fetchCollectionData } from './fetchCollectionData'
import { getCollection } from './getCollection'
import { installCollectionIcon } from './installCollectionIcon'

export const GET_IMPORT_TASK_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  name: assert.stringNotEmpty,
})

export type GetImportTaskOptions = Loose<ReturnType<typeof GET_IMPORT_TASK_OPTIONS_SCHEMA>>

export async function installCollection(this: ModuleIconCollection, options: GetImportTaskOptions): Promise<void> {
  const moduleUser = this.getModule(ModuleUser)
  const { name, user } = GET_IMPORT_TASK_OPTIONS_SCHEMA(options)

  // --- Check if the user is a super administrator.
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_UNAUTHORIZED()

  // --- Check if the collection is already installed.
  const collection = await getCollection.call(this, { user, name })
  if (collection.status === 'Installed') throw this.errors.ICON_COLLECTION_ALREADY_INSTALLED(name)

  // --- Download the icon data and for each icon, create and save it in the database.
  await this.iconEventBus.broadcast({ event: 'installStart', collection: name })
  const data = await fetchCollectionData.call(this, name)

  // --- If the collection is not found, throw an error.
  let index = 0
  const total = Object.keys(data.icons).length
  for (const name in data.icons) {
    await installCollectionIcon.call(this, { name, data, collection })

    // --- Every 10 icons, broadcast the progress.
    const isIndex10 = index % 10 === 0
    const isIndexLast = index === total - 1
    if (isIndexLast || isIndex10) {
      await this.iconEventBus.broadcast({
        event: 'installIconDone',
        icon: name,
        collection: collection.name,
        currentIcon: index,
        totalIcons: total,
      })
    }
    index++
  }

  // --- Broadcast the completion of the collection installation.
  const { IconCollection } = this.getRepositories()
  collection.status = 'Installed'
  await IconCollection.save(collection)
  await this.iconEventBus.broadcast({ event: 'installDone', collection: name })
}
