import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'
import { createStoragePoolFs } from './createStoragePoolFs'
import { ERRORS } from './errors'
import { getPool } from './getPool'

describe.concurrent<Context>('getPool', (it) => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  it('should return the default pool if no ID is provided', async({ moduleStorage }) => {
    const pool = createStoragePoolFs()
    moduleStorage.storagePools.set('default', pool)
    const result = await getPool.call(moduleStorage)
    expect(result).toBe(pool)
  })

  it('should return the specified pool if a valid ID is provided', async({ moduleStorage }) => {
    const pool = createStoragePoolFs()
    moduleStorage.storagePools.set('custom', pool)
    const result = await getPool.call(moduleStorage, 'custom')
    expect(result).toBe(pool)
  })

  it('should throw an error if the pool is not found', async({ moduleStorage }) => {
    const shouldReject =getPool.call(moduleStorage, 'non-existent')
    const error = ERRORS.STORAGE_POOL_NOT_FOUND('non-existent')
    await expect(shouldReject).rejects.toThrowError(error)
  })
})
