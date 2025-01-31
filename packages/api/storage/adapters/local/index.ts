export * from './download'
export * from './erase'
export * from './initialize'
export * from './purge'
export * from './upload'

export interface ModuleStorageLocalOptions {

  /**
   * The path to the directory where the assets are stored on the local filesystem.
   * This is used as a fallback when the S3 client is not available.
   *
   * @default '.data/storage'
   */
  storageLocalPath: string
}
