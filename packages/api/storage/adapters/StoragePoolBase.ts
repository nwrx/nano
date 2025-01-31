/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable n/no-unsupported-features/node-builtins */
import type { Derive } from '@unshared/binary'
import type { Awaitable } from '@unshared/functions'
import type { MaybeFunction, MaybePromise } from '@unshared/types'
import type { Hash } from 'node:crypto'
import type { RemoveOptions } from 'typeorm'
import type { StorageFile } from '../entities'
import { deriveStreamHash } from '@unshared/binary'
import { Readable } from 'node:stream'
import { ReadableStream as NodeReadableStream } from 'node:stream/web'

export interface FileLike {
  stream: MaybeFunction<MaybePromise<Buffer | NodeReadableStream | Readable | ReadableStream | string>>
  name: string
  type: string
  size: number
  source?: string
}

export interface FileToStreamResult {
  stream: Readable
  hash: Awaitable<Derive<unknown>, Hash>
}

export interface StorageDownloadOptions {
  offset?: number
  size?: number
  abortSignal?: AbortSignal
}

export interface StorageDownloadResult {
  getUrl?: () => Promise<string>
  getText: () => Promise<string>
  getData: () => Promise<Buffer>
  getBase64Url: () => Promise<string>
  getStream: () => Promise<Readable>
  getContentLength: () => Promise<number>
  getContentType: () => Promise<string>
}

export interface StoragePurgeResult {
  size: number
  count: number
}

export interface StorageUploadOptions {
  abortSignal?: AbortSignal
}

export interface StorageEraseOptions extends RemoveOptions {
  abortSignal?: AbortSignal
}

export abstract class StoragePoolBase {

  /**
   * Initializes a new instance of the storage pool.
   *
   * @param name The unique identifier of the storage pool.
   */
  constructor(public name: string) {}

  /**
   * The kind of storage pool.
   */
  readonly kind: string

  /**
   * Purges all the files from the storage that are not referenced by
   * any entity in the database.
   */
  initialize(): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Uploads a file to the storage.
   *
   * @param file The file to upload.
   * @param options The options to use to upload the file.
   */
  upload(file: FileLike, options?: StorageUploadOptions): Promise<StorageFile> {
    throw new Error('Not implemented')
  }

  /**
   * Downloads a file from the storage.
   *
   * @param file The file to download.
   * @param options The options to use to download the file.
   */
  download(file: StorageFile, options?: StorageDownloadOptions): StorageDownloadResult {
    throw new Error('Not implemented')
  }

  /**
   * Deletes a file from the storage.
   *
   * @param file The file to delete.
   * @param options The options to use to delete the file.
   */
  erase(file: StorageFile, options?: StorageEraseOptions): Promise<void> {
    throw new Error('Not implemented')
  }

  /**
   * Converts a `FileLike` object to a stream and derives the hash of the stream.
   *
   * @param data The data to convert to a stream.
   * @returns The stream and the hash of the stream.
   */
  protected async fileToStream(data: FileLike | FileLike['stream']): Promise<FileToStreamResult> {
    const hash = deriveStreamHash('sha256') as Awaitable<Derive<unknown>, Hash>

    // --- Extract the data from the `FileLike` object.
    if (data instanceof File) data = data.stream()
    if (typeof data === 'object' && 'stream' in data) data = data.stream

    // --- Call function and resolve promises.
    if (typeof data === 'function') data = data()
    if (data instanceof Promise) data = await data

    if (typeof data === 'string') data = Buffer.from(data)
    if (data instanceof Buffer) data = Readable.from(data)
    else if (data instanceof NodeReadableStream) data = Readable.fromWeb(data)
    else if (data instanceof ReadableStream) data = Readable.fromWeb(data as NodeReadableStream)
    else data = Readable.from(data)

    // --- Pipe the data to the hash stream and return the stream and hash.
    const stream = data.pipe(hash)
    return { stream, hash }
  }
}
