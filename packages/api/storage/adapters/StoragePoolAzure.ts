import type { ContainerClient } from '@azure/storage-blob'
import type { FileLike, StorageDownloadOptions, StorageDownloadResult, StorageEraseOptions, StorageUploadOptions } from './StoragePoolBase'
import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob'
import { Readable } from 'node:stream'
import { StorageFile } from '../entities'
import { StoragePoolBase } from './StoragePoolBase'

export interface StoragePoolAzureOptions {

  /**
   * The kind of storage pool. This value should be `AzureBlobStorage`.
   */
  kind: 'AzureBlobStorage'

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

export class StoragePoolAzure extends StoragePoolBase implements StoragePoolAzureOptions {
  constructor(public name = 'Default', options: StoragePoolAzureOptions) {
    super(name)
    this.blobServiceClient = options.blobServiceClient
    this.containerClient = options.containerClient
    this.containerName = options.containerName
    this.connectionString = options.connectionString
  }

  readonly kind = 'AzureBlobStorage'
  containerName: string
  connectionString: string
  containerClient: ContainerClient
  blobServiceClient?: BlobServiceClient

  /**
   * Initializes the Azure Blob storage client and the container client.
   */
  async initialize(): Promise<void> {
    if (this.blobServiceClient instanceof BlobServiceClient) return

    // --- Assert that the required options are provided.
    if (!this.connectionString) throw new Error('The connection string is required to connect to the Azure Storage container.')
    if (!this.containerName) throw new Error('The container name is required to connect to the Azure Storage container.')

    // --- Instantiate the Azure Blob client and the container client.
    this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString)
    this.containerClient = this.blobServiceClient.getContainerClient(this.containerName)

    // --- Check if the client is working by listing the containers.
    const containers = this.blobServiceClient.listContainers()
    for await (const container of containers) if (container.name === this.containerName) return
    throw new Error(`The container "${this.containerName}" does not exist in the Azure Storage account.`)
  }

  /**
   * Uploads the file to the Azure Blob storage. The file is uploaded as a block blob
   * with the specified content type and content disposition. Note that it is the responsibility
   * of the caller to save the `StorageFile` entity to the database.
   *
   * @param file The file to upload.
   * @param options The options to use to upload the file.
   * @returns A promise that resolves to a `StorageFile` entity.
   */
  async upload(file: FileLike, options: StorageUploadOptions = {}): Promise<StorageFile> {
    if (!this.containerName) throw new Error('The Azure Blob container name is required.')
    if (!this.blobServiceClient) throw new Error('The Azure Blob storage client is not initialized.')

    // --- Extract the stream from the `FileLike` object, derive the hash
    // --- and conditionally convert the stream from a web stream to a node stream.
    const { stream, hash } = await this.fileToStream(file)

    // --- Upload the data to the Azure Blob storage.
    const entity = new StorageFile()
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName)
    const blockBlobClient = containerClient.getBlockBlobClient(entity.id)
    await blockBlobClient.uploadStream(stream, file.size, 5, {
      abortSignal: options.abortSignal,
      blobHTTPHeaders: {
        blobContentType: file.type,
        blobContentDisposition: `inline; filename="${file.name}"`,
      },
    })

    // --- Once the data is uploaded, resolve the hash value.
    entity.hash = await hash.then(hash => hash.digest('hex'))
    return entity
  }

  /**
   * Create a `StorageDownloadResult` object to download the file from the Azure Blob storage.
   * The download result provides methods to get the file data, text, stream and other properties.
   *
   * @param file The file to download.
   * @param options The options to use to download the file.
   * @returns A `StorageDownloadResult` object.
   */
  download(file: StorageFile, options: StorageDownloadOptions = {}): StorageDownloadResult {
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
  }

  /**
   * Erases the file from the Azure Blob storage.
   *
   * @param file The file to erase.
   * @param options The options to use to erase the file.
   * @returns A promise that resolves when the file is erased.
   */
  async erase(file: StorageFile, options: StorageEraseOptions = {}): Promise<void> {
    if (!this.blobServiceClient) throw new Error('The Azure Blob storage client is not initialized.')
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName)
    const blockBlobClient = containerClient.getBlockBlobClient(file.id)
    await blockBlobClient.delete({ abortSignal: options.abortSignal })
  }
}
