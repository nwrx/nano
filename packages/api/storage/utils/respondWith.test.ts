import type { Context } from '../../__fixtures__'
import type { FileLike } from './fileToStream'
import { createTestEvent } from '@unserved/server'
import { createTestContext } from '../../__fixtures__'
import { respondWith } from './respondWith'
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

describe<Context>('respondWith', (it) => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  it('should respond with the file stream', async({ moduleStorage }) => {
    const file = createFileLike()
    const entity = await upload.call(moduleStorage, file)
    const event = createTestEvent()
    const result = await respondWith.call(moduleStorage, event, entity)
    const headers = event.node.res.getHeaders()
    // @ts-expect-error: the `_data` property is not typed
    const stream = event.node.res._data as NodeJS.ReadableStream
    const text = await new Promise((resolve) => {
      let data = ''
      stream.on('data', (chunk) => { data += chunk })
      stream.on('end', () => { resolve(data) })
    })
    expect(result).toBeUndefined()
    expect(headers).toMatchObject({ 'content-type': 'text/plain', 'content-length': 13 })
    expect(text).toBe('Hello, world!')
  })

  it('should respond with a redirect if the file has a URL', async({ moduleStorage }) => {
    const pool = moduleStorage.storagePools.get('default')
    // @ts-expect-error: ignore the error for testing purposes
    pool!.download = vi.fn(() => ({ getUrl: () => 'https://example.com/hello.txt' }))
    const event = createTestEvent()
    const file = createFileLike()
    const entity = await upload.call(moduleStorage, file)
    const result = await respondWith.call(moduleStorage, event, entity)
    const headers = event.node.res.getHeaders()
    expect(result).toBeUndefined()
    expect(headers).toMatchObject({ location: 'https://example.com/hello.txt' })
    expect(event.node.res.statusCode).toBe(302)
    expect(event.node.res.statusMessage).toBe('Found')
  })

  it('should respond with the file as an attachment if isAttachment is true', async({ moduleStorage }) => {
    const file = createFileLike()
    const entity = await upload.call(moduleStorage, file)
    const event = createTestEvent()
    const result = await respondWith.call(moduleStorage, event, entity, { isAttachment: true })
    const headers = event.node.res.getHeaders()
    // @ts-expect-error: the `_data` property is not typed
    const stream = event.node.res._data as NodeJS.ReadableStream
    const text = await new Promise((resolve) => {
      let data = ''
      stream.on('data', (chunk) => { data += chunk })
      stream.on('end', () => { resolve(data) })
    })
    expect(result).toBeUndefined()
    expect(headers).toMatchObject({ 'content-type': 'text/plain', 'content-length': 13, 'content-disposition': 'attachment; filename="hello.txt"' })
    expect(text).toBe('Hello, world!')
  })
})
