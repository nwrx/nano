import type { Context } from '../../__fixtures__'
import type { FileLike } from './fileToStream'
import { createTestContext } from '../../__fixtures__'
import { download } from './download'
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

describe<Context>('upload', (it) => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  it('should upload the file to the storage pool and return the entity', async({ moduleStorage }) => {
    const file = createFileLike()
    const entity = await upload.call(moduleStorage, file)
    const result = await download.call(moduleStorage, entity)
    const data = await result.getText()
    expect(data).toBe('Hello, world!')
    expect(entity).toMatchObject({
      name: 'hello.txt',
      type: 'text/plain',
      size: 13,
      pool: 'default',
      origin: 'upload',
    })
  })

  it('should throw an error if the pool does not exist', async({ moduleStorage }) => {
    const file = createFileLike()
    const shouldReject = upload.call(moduleStorage, { ...file, pool: 'non-existent-pool' })
    const error = ERRORS.STORAGE_POOL_NOT_FOUND('non-existent-pool')
    await expect(shouldReject).rejects.toThrow(error)
  })
})
