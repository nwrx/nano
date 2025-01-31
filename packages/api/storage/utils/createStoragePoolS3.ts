import type { StoragePool } from './createStoragePool'
import { CreateBucketCommand, DeleteObjectCommand, GetObjectCommand, ListBucketsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Readable } from 'node:stream'
import { StorageFile } from '../entities'
import { fileToStream } from './fileToStream'

export interface StoragePoolS3Options {

  /**
   * The S3 client used to interact with the S3-Compatible bucket. If provided,
   * the module will not create a new client and will use the provided one.
   *
   * @example new S3Client({ region: 'us-east-1' })
   */
  client?: S3Client

  /**
   * The name of the S3-Compatible bucket where the assets are stored.
   *
   * @example 'my-bucket-name'
   */
  bucketName: string

  /**
   * The region of the S3-Compatible bucket where the assets are stored.
   *
   * @example 'us-east-1'
   */
  bucketRegion: string

  /**
   * The endpoint of the S3-Compatible bucket where the assets are stored.
   *
   * @example 'https://my-bucket-name.s3.amazonaws.com'
   */
  bucketEndpoint: string

  /**
   * The access key of the S3-Compatible bucket where the assets are stored.
   * This key should have read access to the bucket.
   *
   * @example 'AKIAIOSFODNN7EXAMPLE'
   */
  bucketAccessKey: string

  /**
   * The secret key of the S3-Compatible bucket where the assets are stored.
   * This key should have read access to the bucket.
   *
   * @example 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
   */
  bucketSecretKey: string

  /**
   * If `true`, the bucket is created if it does not exist when the module is initialized.
   * If `false`, an error is thrown if the bucket does not exist.
   *
   * @default false
   */
  createBucket: boolean
}

export function createStoragePoolS3(options: StoragePoolS3Options): StoragePool {
  const { bucketName, bucketRegion, bucketEndpoint, bucketAccessKey, bucketSecretKey, createBucket } = options
  let client: S3Client | undefined = options.client

  return {
    async initialize() {
      if (!bucketName) throw new Error('The S3 bucket name is required.')
      if (!bucketRegion) throw new Error('The S3 bucket region is required.')
      if (!bucketEndpoint) throw new Error('The S3 bucket endpoint is required.')
      if (!bucketAccessKey) throw new Error('The S3 bucket access key is required.')
      if (!bucketSecretKey) throw new Error('The S3 bucket secret key is required.')

      if (!client) {
        client = new S3Client({
          credentials: {
            accessKeyId: bucketAccessKey,
            secretAccessKey: bucketSecretKey,
          },
          region: bucketRegion,
          endpoint: bucketEndpoint,
          forcePathStyle: true,
        })
      }

      // --- Check if the bucket exists or create it if required.
      const command = new ListBucketsCommand({})
      const response = await client.send(command)
      const exists = response.Buckets?.find(x => x.Name === bucketName)

      // --- If the bucket exists, return early. If not, throw an error if the bucket should exist.
      if (exists) return
      if (!createBucket) throw new Error(`The bucket "${bucketName}" does not exist`)

      // --- Create the bucket if it does not exist.
      const create = new CreateBucketCommand({ Bucket: bucketName })
      await client.send(create)
    },

    async upload(file) {
      if (!bucketName) throw new Error('The S3 bucket name is required.')
      if (!client) throw new Error('The S3 client is not initialized.')
      const { abortSignal } = file

      // --- Extract the stream from the `FileLike` object, derive the hash
      // --- and conditionally convert the stream from a web stream to a node stream.
      const { stream, hash } = fileToStream(file)

      // --- Create the S3 command to upload the file.
      const entity = new StorageFile()
      const command = new PutObjectCommand({
        ACL: 'private',
        Body: stream,
        Key: entity.id,
        Bucket: bucketName,
        ContentType: file.type,
        ContentDisposition: `inline; filename="${file.name}"`,
        Metadata: { Name: file.name },
      })

      // --- Send the command to the S3 client.
      const output = await client.send(command, { abortSignal })
      if (!output.ETag) throw new Error('Could not upload the file to the S3 bucket')

      // --- Once done, update the entity and return it.
      entity.hash = await hash.then(hash => hash.digest('hex'))
      return entity
    },

    download(file, options = {}) {
      if (!client) throw new Error('The S3 client is not initialized.')
      const { offset = 0, size, abortSignal } = options
      const range = size ? `bytes=${offset}-${offset + size}` : `bytes=${offset}-`
      const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: file.id, Range: range })

      return {
        async getUrl() {
          return await getSignedUrl(client!, getObjectCommand, { expiresIn: 60 })
        },

        async getStream() {
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
