/* eslint-disable sonarjs/publicly-writable-directories */
import type { StoragePool } from './createStoragePool'
import { createReadStream, createWriteStream } from 'node:fs'
import { mkdir, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { StorageFile } from '../entities'
import { ERRORS } from './errors'
import { fileToStream } from './fileToStream'

export interface StoragePoolFSOptions {

  /**
   * The path to the local storage directory.
   *
   * @default '/tmp/storage'
   */
  path?: string
}

export function createStoragePoolFs(options: StoragePoolFSOptions = {}): StoragePool {
  const { path = '/tmp/storage' } = options
  return {
    async initialize() {
      await mkdir(path, { recursive: true })
    },

    async upload(file) {
      const { stream, hash, size } = fileToStream(file)
      const { abortSignal, origin: origin, name, type, pool } = file

      // --- Upload the data to the Azure Blob storage.
      const entity = new StorageFile()
      const filePath = join(path, entity.id)
      const writeStream = createWriteStream(filePath, { signal: abortSignal })
      stream.pipe(writeStream)

      // --- Wait for the stream to finish writing the data to the local filesystem.
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
      })

      // --- Assert we have a name and type.
      if (!name) throw ERRORS.STORAGE_UPLOAD_MISSING_FILE_NAME()
      if (!type) throw ERRORS.STORAGE_UPLOAD_MISSING_FILE_TYPE()

      // --- Otherwise, save the asset to the database and return it.
      entity.name = name
      entity.type = type
      entity.pool = pool
      entity.origin = origin
      entity.size = await size
      entity.hash = await hash.then(hash => hash.digest('hex'))
      return entity
    },

    download(file, options = {}) {
      const { offset = 0, size = file.size, abortSignal } = options
      const filePath = join(path, file.id)
      return {
        async getStream() {
          const stream = createReadStream(filePath, {
            start: offset,
            end: size ? offset + size : undefined,
            signal: abortSignal,
          })
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

      // --- Assert that the file exists and is not a directory.
      const filePath = join(path, file.id)
      const fileStat = await stat(filePath)
      const isFile = fileStat.isFile()
      if (!isFile) throw ERRORS.STORAGE_ERASE_FS_NOT_FILE(file.id)

      // --- Delete the data from the disk.
      await rm(filePath, { force: true })
    },
  }
}
