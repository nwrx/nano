import type { ModuleStorage } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function fileUpload(this: ModuleStorage) {
  return createHttpRoute(
    {
      name: 'POST /api/storage',
      parseFormData: createParser({
        file: assert.instance(File),
      }),
    },
    async({ event, formData }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)

      // --- Only the super-admin can upload files.
      if (!user.isSuperAdministrator) throw userModule.errors.USER_NOT_ALLOWED()

      // --- Create an abort signal to cancel the upload.
      const abortController = new AbortController()
      const abortSignal = abortController.signal
      event.node.req.on('aborted', () => abortController.abort())

      // --- Save the file to the database.
      const { StorageFile } = this.getRepositories()
      const entity = await this.upload(formData.file, { abortSignal })
      await StorageFile.save(entity)
    },
  )
}
