import type { FileLike, StorageDownloadOptions, StorageDownloadResult, StorageEraseOptions, StorageUploadOptions } from './StoragePoolBase'
import { CreateBucketCommand, DeleteObjectCommand, GetObjectCommand, ListBucketsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Readable } from 'node:stream'
import { StorageFile } from '../entities'
import { StoragePoolBase } from './StoragePoolBase'

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

export class StoragePoolS3 extends StoragePoolBase implements StoragePoolS3Options {
  constructor(public name = 'Default', options: StoragePoolS3Options) {
    super(name)
    this.bucketName = options.bucketName
    this.bucketRegion = options.bucketRegion
    this.bucketEndpoint = options.bucketEndpoint
    this.bucketAccessKey = options.bucketAccessKey
    this.bucketSecretKey = options.bucketSecretKey
    this.createBucket = options.createBucket
  }

  readonly kind = 'S3Compatible'
  bucketName: string
  bucketRegion: string
  bucketEndpoint: string
  bucketAccessKey: string
  bucketSecretKey: string
  createBucket: boolean
  client: S3Client

  async initialize(): Promise<void> {
    this.client = this.client ?? new S3Client({
      credentials: {
        accessKeyId: this.bucketAccessKey,
        secretAccessKey: this.bucketSecretKey,
      },
      region: this.bucketRegion,
      endpoint: this.bucketEndpoint,
      forcePathStyle: true,
    })

    // --- Check if the bucket exists or create it if required.
    const command = new ListBucketsCommand({})
    const response = await this.client.send(command)
    const exists = response.Buckets?.find(x => x.Name === this.bucketName)

    // --- If the bucket exists, return early. If not, throw an error if the bucket should exist.
    if (exists) return
    if (!this.createBucket) throw new Error(`The bucket "${this.bucketName}" does not exist`)

    // --- Create the bucket if it does not exist.
    const create = new CreateBucketCommand({ Bucket: this.bucketName })
    await this.client.send(create)
  }

  async upload(file: FileLike, options: StorageUploadOptions = {}): Promise<StorageFile> {
    if (!this.bucketName) throw new Error('The S3 bucket name is required.')
    if (!this.client) throw new Error('The S3 client is not initialized.')
    const { abortSignal } = options

    // --- Extract the stream from the `FileLike` object, derive the hash
    // --- and conditionally convert the stream from a web stream to a node stream.
    const { stream, hash } = await this.fileToStream(file)

    // --- Create the S3 command to upload the file.
    const entity = new StorageFile()
    const command = new PutObjectCommand({
      ACL: 'private',
      Body: stream,
      Key: entity.id,
      Bucket: this.bucketName,
      ContentType: file.type,
      ContentLength: file.size,
      ContentDisposition: `inline; filename="${file.name}"`,
      Metadata: { Name: file.name },
    })

    // --- Send the command to the S3 client.
    const output = await this.client.send(command, { abortSignal })
    if (!output.ETag) throw new Error('Could not upload the file to the S3 bucket')

    // --- Once done, update the entity and return it.
    entity.hash = await hash.then(hash => hash.digest('hex'))
    return entity
  }

  download(file: StorageFile, options: StorageDownloadOptions = {}): StorageDownloadResult {
    if (!this.client) throw new Error('The S3 client is not initialized.')

    // --- Extract options and instance properties.
    const { offset = 0, size, abortSignal } = options
    const { client, bucketName } = this
    const range = size ? `bytes=${offset}-${offset + size}` : `bytes=${offset}-`

    // --- Create the shared download command.
    return {
      async getUrl() {
        const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: file.id, Range: range })
        return await getSignedUrl(client, getObjectCommand, { expiresIn: 60 })
      },

      async getStream() {
        const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: file.id, Range: range })
        const { Body } = await client.send(getObjectCommand, { abortSignal })
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
        const output = await client.send(getObjectCommand)
        if (!output.ContentLength) throw new Error('The content length is missing.')
        return output.ContentLength
      },

      async getContentType() {
        const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: file.id })
        const output = await client.send(getObjectCommand)
        if (!output.ContentType) throw new Error('The content type is missing.')
        return output.ContentType
      },
    }
  }

  async erase(entity: StorageFile, options: StorageEraseOptions = {}): Promise<void> {
    if (!this.client) throw new Error('The S3 client is not initialized.')
    const { abortSignal } = options

    // --- Delete the data from the bucket.
    const command = new DeleteObjectCommand({
      Key: entity.id,
      Bucket: this.bucketName,
    })

    // --- Send the command to the S3 client first so if it fails, the asset is not removed
    // --- from the database and the operation can be retried later.
    await this.client.send(command, { abortSignal })
  }
}
