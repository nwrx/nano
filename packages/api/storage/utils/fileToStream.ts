import type { Derive } from '@unshared/binary'
import type { Awaitable } from '@unshared/functions'
import type { Hash } from 'node:crypto'
import type { ReadableStream as NodeReadableStream } from 'node:stream/web'
import type { FileLike } from './assertFileLike'
import type { FileLikeData } from './assertFileLikeData'
import { deriveStreamHash, deriveStreamLength } from '@unshared/binary'
import { Readable } from 'node:stream'
import { ERRORS } from './errors'

export interface FileToStreamResult {
  stream: Readable
  size: Awaitable<Derive<unknown>, number>
  hash: Awaitable<Derive<unknown>, Hash>
}

export function fileToStream(file: FileLike, signal?: AbortSignal): FileToStreamResult {
  const result = {} as FileToStreamResult
  let stream: FileLikeData

  // --- Extract the data from the `FileLike` object.
  if (typeof file === 'object' && file !== null && 'data' in file) stream = file.data
  else if (file instanceof File) stream = file.stream()
  else throw ERRORS.STORAGE_UPLOAD_INVALID_FILE_LIKE_OBJECT()

  // --- Ensure the stream is a Readable stream.
  if (typeof stream === 'string') stream = Readable.from(stream, { signal })
  else if (stream instanceof Buffer) stream = Readable.from(stream, { signal })
  else if (stream instanceof Readable) stream = Readable.from(stream, { signal })
  else if (stream instanceof ReadableStream) stream = Readable.fromWeb(stream as NodeReadableStream, { signal })
  else throw ERRORS.STORAGE_UPLOAD_INVALID_FILE_LIKE_OBJECT()

  // --- Pipe the data to the hash stream and return the stream and hash.
  result.size = deriveStreamLength()
  result.hash = deriveStreamHash('sha256')
  result.stream = stream.pipe(result.hash).pipe(result.size)
  return result
}
