import type { Bucket } from '@google-cloud/storage'
import type { StoragePoolAdapter } from './createStoragePoolAdapter'
import { Storage } from '@google-cloud/storage'
import { StorageFile } from '../entities'
import { fileToStream } from '../utils'

/** The options to create a Google Cloud Storage pool. */
export interface StoragePoolGcsOptions {

  /**
   * The name of the Google Cloud Storage bucket where the data is stored.
   *
   * @example 'my-bucket-name'
   */
  bucket: string

  /**
   * The Google Cloud project ID.
   *
   * @example 'my-project-id'
   */
  projectId: string

  /**
   * The path to the service account key file (optional).
   * If not provided, Application Default Credentials will be used.
   *
   * @example '/path/to/service-account-key.json'
   */
  keyFilename?: string

  /**
   * The service account email (optional).
   * Used when authenticating with service account credentials.
   *
   * @example 'service-account@my-project.iam.gserviceaccount.com'
   */
  clientEmail?: string

  /**
   * The private key for the service account (optional).
   * Used when authenticating with service account credentials.
   */
  privateKey?: string
}

/**
 * Creates a Google Cloud Storage pool with the given options.
 *
 * @param options The options to create the Google Cloud Storage pool.
 * @returns A storage pool that can be used to upload, download, and erase files in Google Cloud Storage.
 * @example
 *
 * // Create a Google Cloud Storage pool with the given options.
 * const pool = createStoragePoolGcs({
 *   bucket: 'my-bucket-name',
 *   projectId: 'my-project-id',
 * })
 *
 * // Initialize the storage pool.
 * await pool.initialize()
 */
export function createStoragePoolGcs(options: StoragePoolGcsOptions): StoragePoolAdapter {
  const { bucket: bucketName, projectId, keyFilename, clientEmail, privateKey } = options
  let storage: Storage | undefined
  let bucket: Bucket | undefined
  return {
    async initialize() {
      if (storage) return

      // --- Assert that the required options are provided.
      if (!bucket) throw new Error('The bucket name is required to connect to the Google Cloud Storage bucket.')
      if (!projectId) throw new Error('The project ID is required to connect to the Google Cloud Storage bucket.')

      // --- Instantiate the Google Cloud Storage client.
      const storageOptions: {
        projectId: string
        keyFilename?: string
        credentials?: { client_email: string; private_key: string }
      } = { projectId }

      // --- Configure authentication if credentials are provided.
      if (keyFilename) {
        storageOptions.keyFilename = keyFilename
      }
      else if (clientEmail && privateKey) {
        storageOptions.credentials = {
          client_email: clientEmail,
          private_key: privateKey,
        }
      }

      // --- Otherwise, use Application Default Credentials (ADC)

      storage = new Storage(storageOptions)
      bucket = storage.bucket(bucketName)

      // --- Check if the bucket exists.
      const [exists] = await bucket.exists()
      if (!exists) throw new Error(`The bucket "${bucketName}" does not exist in the Google Cloud Storage project.`)
    },

    async upload(file, options = {}) {
      if (!bucket) throw new Error('The Google Cloud Storage bucket is not initialized.')
      const { abortSignal } = options
      const { stream, hash } = fileToStream(file)
      const { name, type } = file

      // --- Create the storage file entity.
      const entity = new StorageFile()
      const gcsFile = bucket.file(entity.id)

      // --- Upload the data to Google Cloud Storage.
      const writeStream = gcsFile.createWriteStream({
        resumable: false,
        metadata: {
          contentType: type,
          contentDisposition: `inline; filename="${name}"`,
          metadata: { originalName: name, id: entity.id },
        },
      })

      // --- Pipe the stream to Google Cloud Storage.
      if (abortSignal) abortSignal.addEventListener('abort', () => writeStream.destroy())
      stream.pipe(writeStream)

      // --- Wait for the upload to complete.
      await new Promise<void>((resolve, reject) => {
        writeStream.on('error', reject)
        writeStream.on('finish', resolve)
      })

      // --- Once the data is uploaded, resolve the hash value.
      entity.hash = await hash.then(hash => hash.digest('hex'))
      return entity
    },

    download(file, options = {}) {
      if (!bucket) throw new Error('The Google Cloud Storage bucket is not initialized.')
      const { offset = 0, size, abortSignal } = options
      const gcsFile = bucket.file(file.id)

      return {
        async getUrl() {
          const expires = Date.now() + 60 * 60 * 1000 // 1 hour
          const [signedUrl] = await gcsFile.getSignedUrl({ action: 'read', expires })
          return signedUrl
        },

        getStream() {
          let start: number | undefined
          let end: number | undefined

          // --- Get the download options based on offset and size.
          // --- If an abort is signaled, destroy the stream.
          if (size !== undefined) [start, end] = [offset, offset + size - 1]
          else if (offset > 0) start = offset
          const stream = gcsFile.createReadStream({ start, end, decompress: true })
          if (abortSignal) abortSignal.addEventListener('abort', () => { stream.destroy() })
          return Promise.resolve(stream)
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
          const [metadata] = await gcsFile.getMetadata()
          if (typeof metadata.size === 'number') return metadata.size
          if (typeof metadata.size === 'string') return Number.parseInt(metadata.size)
          throw new Error('The content length is missing.')
        },

        async getContentType() {
          const [metadata] = await gcsFile.getMetadata()
          return metadata.contentType ?? 'application/octet-stream'
        },
      }
    },

    async erase(file, _options = {}) {
      if (!bucket) throw new Error('The Google Cloud Storage bucket is not initialized.')
      const gcsFile = bucket.file(file.id)
      await gcsFile.delete()
    },
  }
}
