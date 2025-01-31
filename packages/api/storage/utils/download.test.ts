import type { Context } from '../../__fixtures__'
import type { FileLike } from './fileToStream'
import { createTestContext } from '../../__fixtures__'
import { download } from './download'
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

describe.concurrent<Context>('download', (it) => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  it('should download the file from the storage pool', async({ moduleStorage }) => {
    const file = createFileLike()
    const entity = await upload.call(moduleStorage, file)
    const result = await download.call(moduleStorage, entity)
    const text = await result.getText()
    expect(text).toBe('Hello, world!')
  })
})
