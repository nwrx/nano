import type { FileLike, StorageDownloadOptions, StorageDownloadResult, StorageUploadOptions } from './StoragePoolBase'
import { createReadStream, createWriteStream } from 'node:fs'
import { mkdir, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { StorageFile } from '../entities'
import { StoragePoolBase } from './StoragePoolBase'

export interface StoragePoolFSOptions {

  /**
   * The path to the local storage directory.
   *
   * @default './.data/storage'
   */
  path: string
}

export class StoragePoolFS extends StoragePoolBase implements StoragePoolFSOptions {
  constructor(public name = 'Default', options: StoragePoolFSOptions) {
    super(name)
    this.path = options.path
  }

  readonly kind = 'LocalFileSystem'
  path = './.data/storage'

  /**
   * Initializes the storage pool by creating the storage directory if it does not exist.
   *
   * @returns A promise that resolves when the storage pool is initialized.
   */
  async initialize(): Promise<void> {
    await mkdir(this.path, { recursive: true })
  }

  /**
   * Uploads the file to the local file system and returns a `StorageFile` entity that represents the file
   * with the specified content type and content disposition. Note that it is the responsibility
   * of the caller to save the `StorageFile` entity to the database.
   *
   * @param file The file to upload.
   * @param options The options to use to upload the file.
   * @returns A promise that resolves to a `StorageFile` entity.
   */
  async upload(file: FileLike, options: StorageUploadOptions = {}): Promise<StorageFile> {
    const { abortSignal } = options

    // --- Extract the stream from the `FileLike` object, derive the hash
    // --- and conditionally convert the stream from a web stream to a node stream.
    const { stream, hash } = await this.fileToStream(file)

    // --- Upload the data to the Azure Blob storage.
    const entity = new StorageFile()
    const filePath = join(this.path, entity.id)
    const writeStream = createWriteStream(filePath)
    stream.pipe(writeStream)
    abortSignal?.addEventListener('abort', () => writeStream.destroy())

    // --- Wait for the stream to finish writing the data to the local filesystem.
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })

    // --- Otherwise, save the asset to the database and return it.
    entity.hash = await hash.then(hash => hash.digest('hex'))
    return entity
  }

  /**
   * Create a `StorageDownloadResult` object to download the file from the local file system.
   * The download result provides methods to get the file data, text, stream and other properties.
   *
   * @param file The file to download.
   * @param options The options to use to download the file.
   * @returns A `StorageDownloadResult` object.
   */
  download(file: StorageFile, options: StorageDownloadOptions = {}): StorageDownloadResult {
    const { offset = 0, size, abortSignal } = options
    const filePath = join(this.path, file.id)

    return {
      getStream() {
        const stream = createReadStream(filePath, { start: offset, end: size ? offset + size : undefined })
        abortSignal?.addEventListener('abort', () => stream.destroy())
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
        const { size } = await stat(filePath)
        return size
      },

      getContentType() {
        return Promise.resolve(file.type)
      },
    }
  }

  /**
   * Erases the file from the local file system. Note that the `StorageFile` entity is not removed
   * from the database and it is the responsibility of the caller to remove the entity from the database.
   *
   * @param file The file to erase.
   * @returns A promise that resolves when the file is erased.
   */
  async erase(file: StorageFile): Promise<void> {

    // --- Assert that the file exists and is not a directory.
    const filePath = join(this.path, file.id)
    const fileStat = await stat(filePath)
    if (!fileStat.isFile()) throw new Error('The file is a directory and cannot be deleted.')

    // --- Delete the data from the disk.
    await rm(filePath, { force: true })
  }
}
