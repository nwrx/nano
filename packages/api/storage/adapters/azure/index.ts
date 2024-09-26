import type { BlobServiceClient, ContainerClient } from '@azure/storage-blob'
import { StoragePool } from '../../utils'
import { download } from './download'
import { erase } from './erase'
import { initialize } from './initialize'
import { upload } from './upload'

export interface StoragePoolAzureOptions {

  /**
   * The kind of storage pool. This value should be `AzureBlobStorage`.
   */
  kind: 'AzureBlobStorage'

  /**
   * The unique ID of the storage pool. This identifier is used to reference a
   * specific storage pool when uploading, downloading, or deleting files.
   */
  id: string

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

export class StoragePoolAzure extends StoragePool implements StoragePoolAzureOptions {
  constructor(options: StoragePoolAzureOptions) {
    super()
    this.id = options.id
    this.blobServiceClient = options.blobServiceClient
    this.containerClient = options.containerClient
    this.containerName = options.containerName
    this.connectionString = options.connectionString
  }

  readonly kind = 'AzureBlobStorage'
  id = 'AzureBlobStorage'
  containerName: string
  connectionString: string
  containerClient: ContainerClient
  blobServiceClient?: BlobServiceClient

  erase = erase.bind(this)
  upload = upload.bind(this)
  download = download.bind(this)
  initialize = initialize.bind(this)
}
