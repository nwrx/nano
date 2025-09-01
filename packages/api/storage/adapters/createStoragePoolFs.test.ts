/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable sonarjs/publicly-writable-directories */
import type { FileLike } from './fileToStream'
import { EXP_UUID } from '@unshared/validation'
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { StorageFile } from '../entities'
import { createStoragePoolFs as createStoragePoolFs } from './createStoragePoolFs'
import { ERRORS } from './errors'

function createFileLike(): FileLike {
  return {
    data: 'Hello, world!',
    name: 'hello.txt',
    type: 'text/plain',
    size: 13,
    pool: 'default',
    origin: 'upload',
    abortSignal: undefined,
  }
}

describe('createStoragePoolFs', () => {
  describe('initialize', () => {
    it('should create the storage directory if it does not exist', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const poolExists = existsSync('/tmp/pool')
      expect(poolExists).toBe(true)
    })

    it('should not throw if the storage directory already exists', async() => {
      mkdirSync('/tmp/pool', { recursive: true })
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      const shouldNotThrow = pool.initialize()
      await expect(shouldNotThrow).resolves.not.toThrow()
    })
  })

  describe('upload', () => {
    it('should upload the File to the local file system', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const file = createFileLike()
      const result = await pool.upload(file)
      const data = readFileSync(`/tmp/pool/${result.id}`, 'utf8')
      expect(data).toBe('Hello, world!')
      expect(result).toBeInstanceOf(StorageFile)
      expect(result).toMatchObject({
        id: expect.stringMatching(EXP_UUID),
        pool: 'default',
        name: 'hello.txt',
        origin: 'upload',
        size: 13,
        type: 'text/plain',
        hash: '315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3',
        assignments: undefined,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: undefined,
      })
    })

    it('should throw when the provided file is not supported', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const shouldReject = pool.upload({ data: 123 } as unknown as FileLike)
      const error = ERRORS.STORAGE_UPLOAD_INVALID_FILE_LIKE_OBJECT()
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw when the file name is missing', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const file = createFileLike()
      // @ts-expect-error: ignore for testing purposes.
      delete file.name
      const shouldReject = pool.upload(file)
      const error = ERRORS.STORAGE_UPLOAD_MISSING_FILE_NAME()
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw when the file type is missing', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const file = createFileLike()
      // @ts-expect-error: ignore for testing purposes.
      delete file.type
      const shouldReject = pool.upload(file)
      const error = ERRORS.STORAGE_UPLOAD_MISSING_FILE_TYPE()
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw on write error', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const file = createFileLike()
      const shouldReject = pool.upload(file)
      rmSync('/tmp/pool', { recursive: true })
      await expect(shouldReject).rejects.toThrow('ENOENT: no such file or directory')
    })
  })

  describe('download', () => {
    it('should return a StorageDownloadResult object', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const file = createFileLike()
      const entity = await pool.upload(file)
      const result = pool.download(entity)
      expect(result).toStrictEqual({
        getStream: expect.any(Function),
        getText: expect.any(Function),
        getData: expect.any(Function),
        getBase64Url: expect.any(Function),
        getContentLength: expect.any(Function),
        getContentType: expect.any(Function),
      })
    })

    it('should return the file data as a stream', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const file = createFileLike()
      const entity = await pool.upload(file)
      const result = pool.download(entity)
      const stream = await result.getStream()
      const data = await new Promise<string>((resolve, reject) => {
        const chunks: Uint8Array[] = []
        stream.on('data', (chunk: Uint8Array) => chunks.push(chunk))
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
        stream.on('error', reject)
      })
      expect(data).toBe('Hello, world!')
    })

    it('should return the file data as text', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const file = createFileLike()
      const entity = await pool.upload(file)
      const result = pool.download(entity)
      const text = await result.getText()
      expect(text).toBe('Hello, world!')
    })

    it('should return the file data as a base64 URL', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const file = createFileLike()
      const entity = await pool.upload(file)
      const result = pool.download(entity)
      const url = await result.getBase64Url()
      expect(url).toBe('data:text/plain;base64,SGVsbG8sIHdvcmxkIQ==')
    })

    it('should return the file content length', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const file = createFileLike()
      const entity = await pool.upload(file)
      const result = pool.download(entity)
      const length = await result.getContentLength()
      expect(length).toBe(13)
    })

    it('should return the file content type', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const file = createFileLike()
      const entity = await pool.upload(file)
      const result = pool.download(entity)
      const type = await result.getContentType()
      expect(type).toBe('text/plain')
    })

    it('should throw on read error', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const file = createFileLike()
      const entity = await pool.upload(file)
      rmSync('/tmp/pool', { recursive: true })
      const result = pool.download(entity)
      const stream = await result.getStream()
      const shouldReject = new Promise((resolve, reject) => {
        stream.on('error', reject)
        stream.on('end', resolve)
      })
      await expect(shouldReject).rejects.toThrow('ENOENT: no such file or directory')
    })

    it.todo('should abort the download if the abort signal is triggered')
  })

  describe('erase', () => {
    it('should erase the file from the local file system', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const file = createFileLike()
      const entity = await pool.upload(file)
      await pool.erase(entity)
      const exists = existsSync(`/tmp/pool/${entity.id}`)
      expect(exists).toBe(false)
    })

    it('should throw when trying to erase a non-existing file', async() => {
      const pool = createStoragePoolFs({ type: 'fs', path: '/tmp/pool' })
      await pool.initialize()
      const entity = new StorageFile()
      const shouldReject = pool.erase(entity)
      await expect(shouldReject).rejects.toThrow('ENOENT: no such file or directory')
    })
  })
})
