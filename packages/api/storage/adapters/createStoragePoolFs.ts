import type { StoragePoolAdapter } from './createStoragePoolAdapter'
import { assertStringPathAbsolute } from '@unshared/validation'
import { createReadStream, createWriteStream } from 'node:fs'
import { mkdir, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { StorageFile } from '../entities'
import { ERRORS, fileToStream } from '../utils'

/** The options to create a filesystem storage pool. */
export interface StoragePoolFSOptions {

  /**
   * The path to the local storage directory.
   */
  path: string
}

/**
 * Creates a filesystem storage pool with the given options.
 *
 * @param options The options to create the filesystem storage pool.
 * @returns A storage pool that can be used to upload, download, and erase files in the local filesystem.
 * @example
 *
 * // Create a filesystem storage pool with the given options.
 * const pool = createStoragePoolFs({
 *   path: '/path/to/local/storage',
 * })
 *
 * // Initialize the storage pool.
 * await pool.initialize()
 */
export function createStoragePoolFs(options: StoragePoolFSOptions): StoragePoolAdapter {
  const { path } = options
  return {
    async initialize() {
      assertStringPathAbsolute(path)
      await mkdir(path, { recursive: true })
    },

    async upload(file, options = {}) {
      const { abortSignal } = options
      const { stream, hash, size } = fileToStream(file, abortSignal)

      // --- Upload the data to the Azure Blob storage.
      const entity = new StorageFile()
      const filePath = join(path, entity.id)
      const writeStream = createWriteStream(filePath, { signal: abortSignal })
      stream.pipe(writeStream)

      // --- Wait for the stream to finish writing the data to the local filesystem.
      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
      })

      // --- Otherwise, save the asset to the database and return it.
      entity.name = file.name
      entity.type = file.type
      entity.size = await size
      entity.hash = await hash.then(hash => hash.digest('hex'))
      return entity
    },

    download(file, options = {}) {
      const { offset = 0, size = file.size, abortSignal } = options
      const filePath = join(path, file.id)
      return {
        async getStream() {
          const start = offset
          const end = size ? offset + size - 1 : undefined
          const stream = createReadStream(filePath, { start, end, signal: abortSignal })
          return await Promise.resolve(stream)
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

        async getContentType() {
          return await Promise.resolve(file.type)
        },
      }
    },

    async erase(file) {
      const filePath = join(path, file.id)
      const fileStat = await stat(filePath)
      const isFile = fileStat.isFile()
      if (!isFile) throw ERRORS.STORAGE_ERASE_FS_NOT_FILE(file.id)
      await rm(filePath, { force: true })
    },
  }
}
