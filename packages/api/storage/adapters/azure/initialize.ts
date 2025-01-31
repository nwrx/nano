import type { StoragePoolAzure } from '.'
import { BlobServiceClient } from '@azure/storage-blob'

export async function initialize(this: StoragePoolAzure): Promise<void> {
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
