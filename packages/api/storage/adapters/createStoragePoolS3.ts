import type { StoragePoolAdapter } from './createStoragePoolAdapter'
import { DeleteObjectCommand, GetObjectCommand, ListBucketsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { assert, createParser } from '@unshared/validation'
import { Readable } from 'node:stream'
import { StorageFile } from '../entities'
import { fileToStream } from '../utils'

/** The parser for options to create an S3-Compatible storage pool. */
export const STORAGE_POOL_S3_OPTIONS_SCHEMA = createParser({

  /**
   * The name of the S3-Compatible bucket where the assets are stored.
   *
   * @example 'my-bucket-name'
   */
  bucketName: assert.stringNotEmpty
    .withName('E_STORAGE_POOL_S3_MISSING_BUCKET_NAME')
    .withMessage('The S3 bucket name is required.'),

  /**
   * The region of the S3-Compatible bucket where the assets are stored.
   *
   * @example 'us-east-1'
   */
  bucketRegion: assert.stringNotEmpty
    .withName('E_STORAGE_POOL_S3_MISSING_BUCKET_REGION')
    .withMessage('The S3 bucket region is required.'),

  /**
   * The endpoint of the S3-Compatible bucket where the assets are stored.
   *
   * @example 'https://my-bucket-name.s3.amazonaws.com'
   */
  bucketEndpoint: assert.stringNotEmpty,

  /**
   * The access key of the S3-Compatible bucket where the assets are stored.
   * This key should have read access to the bucket.
   *
   * @example 'AKIAIOSFODNN7EXAMPLE'
   */
  bucketAccessKey: assert.stringNotEmpty
    .withName('E_STORAGE_POOL_S3_MISSING_ACCESS_KEY')
    .withMessage('The S3 bucket access key is required.'),

  /**
   * The secret key of the S3-Compatible bucket where the assets are stored.
   * This key should have read access to the bucket.
   *
   * @example 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
   */
  bucketSecretKey: assert.stringNotEmpty
    .withName('E_STORAGE_POOL_S3_MISSING_SECRET_KEY')
    .withMessage('The S3 bucket secret key is required.'),
})

/** The options for creating an S3-Compatible storage pool. */
export type StoragePoolS3Options = ReturnType<typeof STORAGE_POOL_S3_OPTIONS_SCHEMA>

/**
 * Creates an S3-Compatible storage pool with the given options.
 *
 * @param options The options to create the S3 storage pool.
 * @returns A storage pool that can be used to upload, download, and erase files in the S3 bucket.
 * @example
 *
 * // Create an S3 storage pool with the given options.
 * const pool = createStoragePoolS3({
 *   bucketName: 'my-bucket-name',
 *   bucketRegion: 'us-east-1',
 *   bucketEndpoint: 'https://my-bucket-name.s3.amazonaws.com',
 *   bucketAccessKey: 'AKIAIOSFODNN7EXAMPLE',
 *   bucketSecretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
 * })
 *
 * // Initialize the storage pool.
 * await pool.initialize()
 */
export function createStoragePoolS3(options: StoragePoolS3Options): StoragePoolAdapter {
  const { bucketName, bucketRegion, bucketEndpoint, bucketAccessKey, bucketSecretKey } = STORAGE_POOL_S3_OPTIONS_SCHEMA(options)
  let client: S3Client | undefined
  return {
    async initialize() {

      // --- Create the S3 client with the provided options.
      client = new S3Client({
        region: bucketRegion,
        endpoint: bucketEndpoint,
        forcePathStyle: true,
        credentials: {
          accessKeyId: bucketAccessKey,
          secretAccessKey: bucketSecretKey,
        },
      })

      // --- Check if the bucket exists it if required.
      const command = new ListBucketsCommand({})
      const response = await client.send(command)
      const exists = response.Buckets?.find(x => x.Name === bucketName)
      if (!exists) throw new Error(`The bucket "${bucketName}" does not exist`)
    },

    async upload(file, options = {}) {
      if (!bucketName) throw new Error('The S3 bucket name is required.')
      if (!client) throw new Error('The S3 client is not initialized.')
      const { abortSignal } = options
      const { stream, hash, size } = fileToStream(file)

      // --- Create the S3 command to upload the file.
      const entity = new StorageFile()
      const command = new PutObjectCommand({
        ACL: 'private',
        Body: stream,
        Key: entity.id,
        Bucket: bucketName,
        ContentType: file.type,
        ContentLength: file.size,
        ContentDisposition: `inline; filename="${file.name}"`,
        Metadata: { Name: file.name },
      })

      // --- Send the command to the S3 client.
      const output = await client.send(command, { abortSignal })
      if (!output.ETag) throw new Error('Could not upload the file to the S3 bucket')

      // --- Once done, update the entity and return it.
      entity.name = file.name
      entity.type = file.type
      entity.size = await size
      entity.hash = await hash.then(hash => hash.digest('hex'))
      return entity
    },

    download(file, options = {}) {
      if (!client) throw new Error('The S3 client is not initialized.')
      const { offset = 0, size, abortSignal } = options
      const range = size ? `bytes=${offset}-${offset + size}` : `bytes=${offset}-`

      return {
        async getUrl() {
          const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: file.id })
          return await getSignedUrl(client!, getObjectCommand, { expiresIn: 60 })
        },

        async getStream() {
          const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: file.id, Range: range })
          const { Body } = await client!.send(getObjectCommand, { abortSignal })
          if (!Body) throw new Error('The file body is missing.')
          const stream = Body.transformToWebStream()
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
          const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: file.id })
          const output = await client!.send(getObjectCommand)
          if (!output.ContentLength) throw new Error('The content length is missing.')
          return output.ContentLength
        },

        async getContentType() {
          const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: file.id })
          const output = await client!.send(getObjectCommand)
          if (!output.ContentType) throw new Error('The content type is missing.')
          return output.ContentType
        },
      }
    },

    async erase(entity, options = {}) {
      if (!client) throw new Error('The S3 client is not initialized.')
      const { abortSignal } = options

      // --- Delete the data from the bucket.
      const command = new DeleteObjectCommand({
        Key: entity.id,
        Bucket: bucketName,
      })

      // --- Send the command to the S3 client first so if it fails, the asset is not removed
      // --- from the database and the operation can be retried later.
      await client.send(command, { abortSignal })
    },
  }
}
