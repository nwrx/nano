/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sonarjs/no-unused-vars */
import type { FileLike } from './fileToStream'
import { Readable } from 'node:stream'
import { ReadableStream as NodeReadableStream } from 'node:stream/web'
import { ERRORS } from './errors'
import { fileToStream } from './fileToStream'

describe('fileToStream', () => {
  const cases: Array<[string, () => File | FileLike]> = [
    [
      'File',
      () => new File(['Hello, world!'], 'hello.txt', { type: 'text/plain' }),
    ],
    [
      'string',
      (): FileLike => ({
        data: 'Hello, world!',
        name: 'hello.txt',
        type: 'text/plain',
        size: 13,
      }),
    ],
    [
      'Buffer',
      () => ({
        data: Buffer.from('Hello, world!'),
        name: 'hello.txt',
        type: 'text/plain',
        size: 13,
      }),
    ],
    [
      'Readable',
      () => ({
        data: Readable.from('Hello, world!'),
        name: 'hello.txt',
        type: 'text/plain',
        size: 13,
      }),
    ],
    [
      'ReadableStream',
      () => ({
        data: new ReadableStream({
          start(controller) {
            controller.enqueue('Hello, world!')
            controller.close()
          },
        }),
        name: 'hello.txt',
        type: 'text/plain',
        size: 13,
      }),
    ],
    [
      'NodeReadableStream',
      () => ({
        data: new NodeReadableStream({
          start(controller) {
            controller.enqueue('Hello, world!')
            controller.close()
          },
        }),
        name: 'hello.txt',
        type: 'text/plain',
        size: 13,
      }),
    ],
  ]

  describe.each(cases)('with FileLike with %s data', (_, data) => {
    it('should extract the stream', async() => {
      const result = fileToStream(data())
      const streamData = await new Promise<string>((resolve, reject) => {
        const chunks: Uint8Array[] = []
        result.stream.on('data', (chunk: Uint8Array) => chunks.push(chunk))
        result.stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
        result.stream.on('error', reject)
      })
      expect(streamData).toBe('Hello, world!')
    })

    it('should return a promise that resolves to the stream size', async() => {
      const result = fileToStream(data())
      for await (const _ of result.stream);
      await expect(result.size).resolves.toBe(13)
    })

    it('should return a promise that resolves to the hash', async() => {
      const result = fileToStream(data())
      for await (const _ of result.stream);
      const digest = result.hash.then(hash => hash.digest('hex'))
      await expect(digest).resolves.toBe('315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3')
    })
  })

  describe('with invalid data', () => {
    it('should throw when the `file` parameter is not an object', () => {
      const shouldThrow = () => fileToStream(null as unknown as FileLike)
      const error = ERRORS.STORAGE_UPLOAD_INVALID_FILE_LIKE_OBJECT()
      expect(shouldThrow).toThrowError(error)
    })

    it('should throw when the `data` property is missing', () => {
      // @ts-expect-error: ignore for testing purposes.
      const shouldThrow = () => fileToStream({})
      const error = ERRORS.STORAGE_UPLOAD_INVALID_FILE_LIKE_OBJECT()
      expect(shouldThrow).toThrowError(error)
    })

    it('should throw when the `data` property is not a valid stream', () => {
      // @ts-expect-error: ignore for testing purposes.
      const shouldThrow = () => fileToStream({ data: null, name: 'hello.txt', type: 'text/plain', size: 13, pool: 'test', origin: 'test' })
      const error = ERRORS.STORAGE_UPLOAD_INVALID_FILE_LIKE_OBJECT()
      expect(shouldThrow).toThrowError(error)
    })
  })
})
