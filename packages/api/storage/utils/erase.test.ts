/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import type { FileLike } from './fileToStream'
import { createTestContext } from '../../__fixtures__'
import { download } from './download'
import { erase } from './erase'
import { ERRORS } from './errors'
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

describe<Context>('erase', (it) => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  it('should erase the file from the storage pool', async({ moduleStorage }) => {
    const file = createFileLike()
    const entity = await upload.call(moduleStorage, file)
    await erase.call(moduleStorage, entity)
    const result = await download.call(moduleStorage, entity)
    const shouldReject = result.getData()
    await expect(shouldReject).rejects.toThrow('ENOENT: no such file or directory')
  })

  it('should throw an error if the pool does not exist', async({ moduleStorage }) => {
    const file = createFileLike()
    // @ts-expect-error: ignore the error for testing purposes
    const shouldReject = erase.call(moduleStorage, { ...file, pool: 'non-existent-pool' })
    const error = ERRORS.STORAGE_POOL_NOT_FOUND('non-existent-pool')
    await expect(shouldReject).rejects.toThrowError(error)
  })

  it('should soft-remove the StorageFile entity from the database', async({ moduleStorage }) => {
    const file = createFileLike()
    const entity = await upload.call(moduleStorage, file)
    await erase.call(moduleStorage, entity)
    const { StorageFile } = moduleStorage.getRepositories()
    const result = await StorageFile.findOneOrFail({ where: { id: entity.id }, withDeleted: true })
    expect(result).toMatchObject({ id: entity.id, deletedAt: expect.any(Date) })
  })
})
