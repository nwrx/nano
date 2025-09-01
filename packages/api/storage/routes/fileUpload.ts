import type { StorageFileObject } from '../entities'
import type { ModuleStorage } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getPool } from '../utils'

export function fileUpload(this: ModuleStorage) {
  return createHttpRoute(
    {
      name: 'POST /workspaces/:workspace/storage/:pool/files',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
      }),
      parseFormData: createParser({
        file: assert.instanceOf(File),
      }),
    },
    async({ event, parameters, formData }): Promise<StorageFileObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const { file } = formData

      // --- Create an abort signal to cancel the upload.
      const abortController = new AbortController()
      const abortSignal = abortController.signal
      event.node.req.on('aborted', () => abortController.abort())

      // --- Get the workspace from the request parameters.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const pool = await getPool.call(this, { name: parameters.pool, user, workspace, permission: 'Write' })

      // --- Upload the file to the storage and return the entity.
      const entity = await this.upload({ user, pool, file, abortSignal })
      return entity.serialize({ withCreatedBy: true })
    },
  )
}
