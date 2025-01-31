export * from './download'
export * from './erase'
export * from './initialize'
export * from './purge'
export * from './upload'

export interface ModuleStorageS3Options {

  /**
   * The S3 client used to interact with the S3-Compatible bucket. If provided,
   * the module will not create a new client and will use the provided one.
   *
   * @example new S3Client({ region: 'us-east-1' })
   */
  storageS3client?: S3Client

  /**
   * The name of the S3-Compatible bucket where the assets are stored.
   *
   * @example 'my-bucket-name'
   */
  storageS3bucketName: string

  /**
   * The region of the S3-Compatible bucket where the assets are stored.
   *
   * @example 'us-east-1'
   */
  storageS3bucketRegion: string

  /**
   * The endpoint of the S3-Compatible bucket where the assets are stored.
   *
   * @example 'https://my-bucket-name.s3.amazonaws.com'
   */
  storageS3bucketEndpoint: string

  /**
   * The access key of the S3-Compatible bucket where the assets are stored.
   * This key should have read access to the bucket.
   *
   * @example 'AKIAIOSFODNN7EXAMPLE'
   */
  storageS3bucketAccessKey: string

  /**
   * The secret key of the S3-Compatible bucket where the assets are stored.
   * This key should have read access to the bucket.
   *
   * @example 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
   */
  storageS3bucketSecretKey: string

  /**
   * If `true`, the bucket is created if it does not exist when the module is initialized.
   * If `false`, an error is thrown if the bucket does not exist.
   *
   * @default false
   */
  storageS3bucketCreate: boolean
}
