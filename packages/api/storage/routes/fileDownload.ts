import type { ModuleStorage } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { getHeader } from 'h3'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getFile, getPool, respondWith } from '../utils'

export function fileDownload(this: ModuleStorage) {
  return createHttpRoute(
    {
      name: 'GET /workspaces/:workspace/storage/:pool/files/:id',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        pool: assert.stringNotEmpty,
        id: assert.stringUuid,
      }),
      parseQuery: createParser({
        isAttachment: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Create an abort signal to cancel the upload.
      const abortController = new AbortController()
      const abortSignal = abortController.signal
      event.node.req.on('aborted', () => abortController.abort())

      // --- Parse the range header.
      const range = getHeader(event, 'Range') ?? ''
      const { start, end } = /bytes=(?<start>\d+)-(?<end>\d+)?/.exec(range)?.groups ?? {}
      const offset = start ? Number.parseInt(start) : 0
      const size = end ? offset + Number.parseInt(end) : undefined

      // --- Get the file from the storage.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const pool = await getPool.call(this, { name: parameters.pool, user, workspace, permission: 'Read' })
      const file = await getFile.call(this, { user, workspace, pool, id: parameters.id, permission: 'Read' })
      return respondWith.call(this, event, { file, pool, offset, size, isAttachment: query.isAttachment, abortSignal })
    },
  )
}
