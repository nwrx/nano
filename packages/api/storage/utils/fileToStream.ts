import type { Derive } from '@unshared/binary'
import type { Awaitable } from '@unshared/functions'
import type { Hash } from 'node:crypto'
import type { ReadableStream as NodeReadableStream } from 'node:stream/web'
import { deriveStreamHash, deriveStreamLength } from '@unshared/binary'
import { Readable } from 'node:stream'
import { ERRORS } from './errors'

export type FileLikeData =
  | Buffer
  | File
  | NodeReadableStream
  | Readable
  | ReadableStream
  | string

export interface FileLike {
  data: FileLikeData
  name: string
  type: string
  size: number
  pool: string
  origin?: string
  abortSignal?: AbortSignal
}

export interface FileToStreamResult {
  stream: Readable
  size: Awaitable<Derive<unknown>, number>
  hash: Awaitable<Derive<unknown>, Hash>
}

export function fileToStream(file: FileLike): FileToStreamResult {
  const result = {} as FileToStreamResult
  let stream: FileLike['data']

  // --- Extract the data from the `FileLike` object.
  if (typeof file === 'object' && file !== null && 'data' in file) stream = file.data
  else throw ERRORS.STORAGE_UPLOAD_INVALID_FILE_LIKE_OBJECT()

  if (typeof stream === 'string') stream = Readable.from(stream, { signal: file.abortSignal })
  else if (stream instanceof Buffer) stream = Readable.from(stream, { signal: file.abortSignal })
  else if (stream instanceof Readable) stream = Readable.from(stream, { signal: file.abortSignal })
  else if (stream instanceof ReadableStream) stream = Readable.fromWeb(stream as NodeReadableStream, { signal: file.abortSignal })
  else if (stream instanceof File) stream = Readable.from(stream.stream(), { signal: file.abortSignal })
  else throw ERRORS.STORAGE_UPLOAD_INVALID_FILE_LIKE_OBJECT()

  // --- Pipe the data to the hash stream and return the stream and hash.
  result.size = deriveStreamLength()
  result.hash = deriveStreamHash('sha256')
  result.stream = stream.pipe(result.hash).pipe(result.size)
  return result
}
