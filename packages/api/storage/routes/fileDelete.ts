import type { ModuleStorage } from '../index'
import { createRoute } from '@unserved/server'
import { assertStringUuid, createSchema } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleUser } from '../../user'

export function fileDelete(this: ModuleStorage) {
  return createRoute(
    {
      name: 'DELETE /api/storage/:id',
      parameters: createSchema({
        id: assertStringUuid,
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { id } = parameters

      // --- Only the super-admin can delete files.
      if (!user.isSuperAdministrator) throw userModule.errors.USER_NOT_ALLOWED()

      // --- Create an abort signal to cancel the action.
      const abortController = new AbortController()
      const abortSignal = abortController.signal
      event.node.req.on('aborted', () => abortController.abort())

      // --- Delete the file from the database.
      const entity = await this.resolveFile(id)
      await this.erase(entity, { abortSignal })
      setResponseStatus(event, 204)
    },
  )
}
