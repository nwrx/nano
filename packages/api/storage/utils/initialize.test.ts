/* eslint-disable @typescript-eslint/unbound-method */
import { ModuleStorage } from '..'
import { createStoragePool } from './createStoragePool'
import { initialize } from './initialize'

describe('initialize', () => {
  it('should call initialize on each storage pool', async() => {
    const moduleStorage = new ModuleStorage()
    // @ts-expect-error: ignore the error for testing purposes
    const pool1 = createStoragePool({ initialize: vi.fn() })
    // @ts-expect-error: ignore the error for testing purposes
    const pool2 = createStoragePool({ initialize: vi.fn() })
    moduleStorage.storagePools.set('pool1', pool1)
    moduleStorage.storagePools.set('pool2', pool2)
    await initialize.call(moduleStorage)
    expect(pool1.initialize).toHaveBeenCalled()
    expect(pool2.initialize).toHaveBeenCalled()
  })
})
