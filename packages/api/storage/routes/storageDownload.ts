import type { ModuleStorage } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertStringUuid, assertUndefined, createParser } from '@unshared/validation'
import { getHeader } from 'h3'
import { ModuleUser } from '../../user'
import { getFile } from '../utils'

export function fileDownload(this: ModuleStorage) {
  return createHttpRoute(
    {
      name: 'GET /storage/:id',
      parseParameters: createParser({
        id: assertStringUuid,
      }),
      parseQuery: createParser({
        download: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { id } = parameters
      const { download: isAttachment } = query

      // --- Only the super-admin can download files by ID.
      if (!user.isSuperAdministrator) throw userModule.errors.USER_FORBIDDEN()

      // --- Abort the download if the request is aborted.
      const abortController = new AbortController()
      const abortSignal = abortController.signal
      event.node.req.on('aborted', () => abortController.abort())

      // --- Parse the range header.
      const range = getHeader(event, 'Range') ?? ''
      const { start, end } = /bytes=(?<start>\d+)-(?<end>\d+)?/.exec(range)?.groups ?? {}
      const offset = start ? Number.parseInt(start) : 0
      const size = end ? offset + Number.parseInt(end) : undefined

      // --- Respond with the file.
      const file = await getFile.call(this, id)
      return this.respondWith(event, file, { offset, size, abortSignal, isAttachment })
    },
  )
}
