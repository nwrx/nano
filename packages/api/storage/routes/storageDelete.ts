import type { ModuleStorage } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertString, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleUser } from '../../user'
import { erase, getFile } from '../utils'

export function storageDelete(this: ModuleStorage) {
  return createHttpRoute(
    {
      name: 'DELETE /api/storage/:pool/:id',
      parseParameters: createSchema({
        id: assertStringUuid,
        pool: [[assertUndefined], [assertString]],
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { id, pool } = parameters

      // --- Only the super-admin can delete files.
      if (!user.isSuperAdministrator) throw userModule.errors.USER_FORBIDDEN()

      // --- Create an abort signal to cancel the action.
      const abortController = new AbortController()
      const abortSignal = abortController.signal
      event.node.req.on('aborted', () => abortController.abort())

      // --- Delete the file from the database.
      const entity = await getFile.call(this, id, pool)
      await erase.call(this, entity, { abortSignal })
      setResponseStatus(event, 204)
    },
  )
}
