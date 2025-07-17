import type { EventStream } from '@unserved/server'
import type { ModuleIconCollection } from '..'
import type { ImportTaskEvent } from '../utils'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getImportTask } from '../utils'

export function iconCollectionInstall(this: ModuleIconCollection) {
  return createHttpRoute(
    {
      name: 'POST /api/icons/collections/:name',
      parseParameters: createParser({
        name: [assert.stringNotEmpty],
      }),
    },
    async({ event, parameters }): Promise<EventStream<ImportTaskEvent>> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)
      const { name } = parameters

      // --- Create or get the import task for the collection.
      const task = getImportTask.call(this, { user, name })
      return task.subscribe(event)
    },
  )
}
