import type { StoragePoolAzure } from '.'
import type { FileLike } from '../../utils'
import { StorageFile } from '../../entities'
import { fileToStream } from '../../utils'

export async function upload(this: StoragePoolAzure, file: FileLike): Promise<StorageFile> {
  if (!this.containerName) throw new Error('The Azure Blob container name is required.')
  if (!this.blobServiceClient) throw new Error('The Azure Blob storage client is not initialized.')

  // --- Extract the stream from the `FileLike` object, derive the hash
  // --- and conditionally convert the stream from a web stream to a node stream.
  const { stream, hash } = await fileToStream(file)

  // --- Upload the data to the Azure Blob storage.
  const entity = new StorageFile()
  const containerClient = this.blobServiceClient.getContainerClient(this.containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(entity.id)
  await blockBlobClient.uploadStream(stream, file.size, 5, {
    blobHTTPHeaders: {
      blobContentType: file.type,
      blobContentDisposition: `inline; filename="${file.name}"`,
    },
  })

  // --- Once the data is uploaded, resolve the hash value.
  const hashValue = await hash.then(hash => hash.digest('hex'))

  // --- Save the entity to the database and return it.
  entity.name = file.name
  entity.type = file.type
  entity.size = file.size
  entity.hash = hashValue
  return entity
}
