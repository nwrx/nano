import type { Context } from '../../__fixtures__'
import type { FileLike } from './fileToStream'
import { createTestContext } from '../../__fixtures__'
import { createStoragePoolFs } from './createStoragePoolFs'
import { ERRORS } from './errors'
import { getFile } from './getFile'
import { upload } from './upload'

function createFileLike(): FileLike {
  return {
    data: 'Hello, world!',
    name: 'hello.txt',
    type: 'text/plain',
    size: 13,
    origin: 'upload',
    pool: 'default',
    abortSignal: undefined,
  }
}

describe.sequential<Context>('getFile', (it) => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  it('should return the StorageFile entity if found', async({ moduleStorage }) => {
    const file = createFileLike()
    const entity = await upload.call(moduleStorage, file)
    const result = await getFile.call(moduleStorage, entity.id)
    expect(result).toStrictEqual(entity)
  })

  it('should throw an error if the pool does not exist', async({ moduleStorage }) => {
    // @ts-expect-error: ignore the error for testing purposes
    const shouldReject = getFile.call(moduleStorage, 'non-existent-id', 'non-existent-pool')
    const error = ERRORS.STORAGE_POOL_NOT_FOUND('non-existent-pool')
    await expect(shouldReject).rejects.toThrowError(error)
  })

  it('should throw if the file is not found in a specific pool', async({ moduleStorage }) => {
    // @ts-expect-error: ignore the error for testing purposes
    const shouldReject = getFile.call(moduleStorage, 'non-existent-id')
    const error = ERRORS.STORAGE_FILE_NOT_FOUND('non-existent-id', 'default')
    await expect(shouldReject).rejects.toThrowError(error)
  })

  it('should return the StorageFile entity if found in a specific pool', async({ moduleStorage }) => {
    const pool = createStoragePoolFs()
    await pool.initialize()
    moduleStorage.storagePools.set('test', pool)
    const file = createFileLike()
    const entity = await upload.call(moduleStorage, { ...file, pool: 'test' })
    const result = await getFile.call(moduleStorage, entity.id, 'test')
    expect(result).toStrictEqual(entity)
  })
})
