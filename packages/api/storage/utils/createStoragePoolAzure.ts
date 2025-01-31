import type { ContainerClient } from '@azure/storage-blob'
import type { StoragePool } from './createStoragePool'
import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob'
import { Readable } from 'node:stream'
import { StorageFile } from '../entities'
import { fileToStream } from './fileToStream'

export interface StoragePoolAzureOptions {

  /**
   * The `BlobServiceClient` used to interact with the Azure Blob storage. If
   * the client is not provided, it is created using the connection string.
   *
   * @example new BlobServiceClient(...)
   */
  blobServiceClient?: BlobServiceClient

  /**
   * The `ContainerClient` used to interact with the Azure Blob storage container.
   * if the client is not provided, it is created using the container name.
   *
   * @example new ContainerClient(...)
   */
  containerClient: ContainerClient

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

export function createStoragePoolAzure(options: StoragePoolAzureOptions): StoragePool {
  const { connectionString, containerName } = options
  let blobServiceClient: BlobServiceClient | undefined
  let containerClient: ContainerClient | undefined

  return {
    async initialize() {
      if (blobServiceClient instanceof BlobServiceClient) return

      // --- Assert that the required options are provided.
      if (!connectionString) throw new Error('The connection string is required to connect to the Azure Storage container.')
      if (!containerName) throw new Error('The container name is required to connect to the Azure Storage container.')

      // --- Instantiate the Azure Blob client and the container client.
      blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
      containerClient = blobServiceClient.getContainerClient(containerName)

      // --- Check if the client is working by listing the containers.
      const containers = blobServiceClient.listContainers()
      for await (const container of containers) if (container.name === containerName) return
      throw new Error(`The container "${containerName}" does not exist in the Azure Storage account.`)
    },

    async upload(file) {
      if (!containerName) throw new Error('The Azure Blob container name is required.')
      if (!blobServiceClient) throw new Error('The Azure Blob storage client is not initialized.')
      const { stream, hash } = fileToStream(file)

      // --- Upload the data to the Azure Blob storage.
      const entity = new StorageFile()
      const containerClient = blobServiceClient.getContainerClient(containerName)
      const blockBlobClient = containerClient.getBlockBlobClient(entity.id)
      await blockBlobClient.uploadStream(stream, file.size, 5, {
        abortSignal: file.abortSignal,
        blobHTTPHeaders: {
          blobContentType: file.type,
          blobContentDisposition: `inline; filename="${file.name}"`,
        },
      })

      // --- Once the data is uploaded, resolve the hash value.
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
