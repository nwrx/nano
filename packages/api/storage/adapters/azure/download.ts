import type { StorageDownloadOptions, StorageDownloadResult } from '~/storage/utils'
import type { StoragePoolAzure } from '.'
import type { StorageFile } from '../../entities'
import { BlobSASPermissions } from '@azure/storage-blob'
import { Readable } from 'node:stream'

export function download(this: StoragePoolAzure, file: StorageFile, options: StorageDownloadOptions = {}): StorageDownloadResult {
  const { offset, size, abortSignal } = options
  const blockBlobClient = this.containerClient.getBlockBlobClient(file.id)

  return {
    async getUrl() {
      return blockBlobClient.generateSasUrl({
        startsOn: new Date(),
        expiresOn: new Date(Date.now() + 3600 * 1000),
        permissions: BlobSASPermissions.from({ read: true }),
      })
    },

    async getStream() {
      const response = await blockBlobClient.download(offset, size, { abortSignal })
      if (!response.readableStreamBody) throw new Error('The response body is not readable.')
      const stream = response.readableStreamBody
      return Readable.from(stream)
    },

    async getData() {
      const stream = await this.getStream()
      return new Promise<Buffer>((resolve, reject) => {
        const chunks: Uint8Array[] = []
        stream.on('data', (chunk: Uint8Array) => chunks.push(chunk))
        stream.on('end', () => resolve(Buffer.concat(chunks)))
        stream.on('error', reject)
      })
    },

    async getText() {
      const buffer = await this.getData()
      return buffer.toString('utf8')
    },

    async getBase64Url() {
      const buffer = await this.getData()
      const url = buffer.toString('base64')
      const response = await blockBlobClient.getProperties({ abortSignal })
      return `data:${response.contentType};base64,${url}`
    },

    async getContentLength() {
      const response = await blockBlobClient.getProperties({ abortSignal })
      return response.contentLength!
    },

    async getContentType() {
      const response = await blockBlobClient.getProperties({ abortSignal })
      return response.contentType!
    },
  }
}
