import type { ModuleStorage } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { erase, getFile, getPool } from '../utils'

export function fileErase(this: ModuleStorage) {
  return createHttpRoute(
    {
      name: 'DELETE /workspaces/:workspace/storage/:pool/files/:id',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        id: assert.stringUuid,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const { user } = await moduleUser.authenticate(event)

      // --- Only the super-admin can delete files.
      if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

      // --- Create an abort signal to cancel the action.
      const abortController = new AbortController()
      const abortSignal = abortController.signal
      event.node.req.on('aborted', () => abortController.abort())

      // --- Get the workspace and pool, then erase the file.
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const pool = await getPool.call(this, { name: parameters.pool, user, workspace, permission: 'Write' })
      const file = await getFile.call(this, { user, workspace, pool, id: parameters.id, permission: 'Write' })
      await erase.call(this, { user, pool, file, abortSignal })
      setResponseStatus(event, 204)
    },
  )
}
