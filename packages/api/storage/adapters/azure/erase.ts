import type { StoragePoolAzure } from '.'
import type { StorageFile } from '../../entities'
import type { StorageEraseOptions } from '../../utils'

export async function erase(this: StoragePoolAzure, file: StorageFile, options: StorageEraseOptions = {}): Promise<void> {
  if (!this.blobServiceClient) throw new Error('The Azure Blob storage client is not initialized.')
  const containerClient = this.blobServiceClient.getContainerClient(this.containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(file.id)
  await blockBlobClient.delete({ abortSignal: options.abortSignal })
}
