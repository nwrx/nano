import type { ContainerClient } from '@azure/storage-blob'
import type { StoragePoolAdapter } from './createStoragePoolAdapter'
import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob'
import { Readable } from 'node:stream'
import { StorageFile } from '../entities'
import { fileToStream } from '../utils'

/** The parser for options to create an Azure Blob storage pool. */
export interface StoragePoolAzureOptions {

  /**
   * The container name in the Azure Blob storage where the data is stored.
   *
   * @example 'my-container-name'
   */
  containerName: string

  /**
   * The storage account connection string used to connect to the Azure Blob storage.
   *
   * @example 'DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey;EndpointSuffix=core.windows.net'
   */
  connectionString: string
}

/**
 * Creates an Azure Blob storage pool with the given options.
 *
 * @param options The options to create the Azure Blob storage pool.
 * @returns A storage pool that can be used to upload, download, and erase files in the Azure Blob storage.
 * @example
 *
 * // Create an Azure Blob storage pool with the given options.
 * const pool = createStoragePoolAzure({
 *   containerName: 'my-container-name',
 *   connectionString: 'DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey;EndpointSuffix=core.windows.net',
 * })
 *
 * // Initialize the storage pool.
 * await pool.initialize()
 */
export function createStoragePoolAzure(options: StoragePoolAzureOptions): StoragePoolAdapter {
  const { connectionString, containerName } = options
  let blobServiceClient: BlobServiceClient | undefined
  let containerClient: ContainerClient | undefined

  return {
    async initialize() {
      if (blobServiceClient !== undefined || containerClient !== undefined)
        throw new Error('The Azure Blob storage pool is already initialized.')
      blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
      containerClient = blobServiceClient.getContainerClient(containerName)

      // --- Check if the client is working by listing the containers.
      const containers = blobServiceClient.listContainers()
      for await (const container of containers) if (container.name === containerName) return
      throw new Error(`The container "${containerName}" does not exist in the Azure Storage account.`)
    },

    async upload(file, options = {}) {
      if (!containerName) throw new Error('The Azure Blob container name is required.')
      if (!blobServiceClient) throw new Error('The Azure Blob storage client is not initialized.')
      const { abortSignal } = options
      const { stream, hash, size } = fileToStream(file, abortSignal)

      // --- Upload the data to the Azure Blob storage.
      const entity = new StorageFile()
      const containerClient = blobServiceClient.getContainerClient(containerName)
      const blockBlobClient = containerClient.getBlockBlobClient(entity.id)
      await blockBlobClient.uploadStream(stream, undefined, 5, {
        abortSignal,
        blobHTTPHeaders: {
          blobContentType: file.type,
          blobContentDisposition: `inline; filename="${file.name}"`,
        },
      })

      // --- Once the data is uploaded, resolve the hash value.
      entity.name = file.name
      entity.type = file.type
      entity.size = await size
      entity.hash = await hash.then(hash => hash.digest('hex'))
      return entity
    },

    download(file, options = {}) {
      if (!containerClient) throw new Error('The Azure Blob container client is not initialized.')
      const { offset, size, abortSignal } = options
      const blockBlobClient = containerClient.getBlockBlobClient(file.id)

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
          const type = await this.getContentType()
          const url = buffer.toString('base64')
          return `data:${type};base64,${url}`
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
    },

    async erase(file, options = {}) {
      if (!blobServiceClient) throw new Error('The Azure Blob storage client is not initialized.')
      const containerClient = blobServiceClient.getContainerClient(containerName)
      const blockBlobClient = containerClient.getBlockBlobClient(file.id)
      await blockBlobClient.delete({ abortSignal: options.abortSignal })
    },
  }
}
