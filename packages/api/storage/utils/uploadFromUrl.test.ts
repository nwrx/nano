/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { EXP_UUID } from '@unshared/validation'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { createTestContext } from '../../__fixtures__'
import { StorageFile } from '../entities'
import { download } from './download'
import { ERRORS } from './errors'
import { uploadFromUrl } from './uploadFromUrl'

describe<Context>('uploadFromUrl', (it) => {
  const urlOk = 'https://jsonplaceholder.typicode.com/todos/1'
  const urlError = 'https://example.com/hello.txt'
  const urlEmpty = 'https://example.com/empty.txt'
  const urlNoContentType = 'https://example.com/no-content-type.txt'
  const urlNoContentLength = 'https://example.com/no-content-length.txt'

  const server = setupServer(
    http.get(urlOk, () => HttpResponse.json({ userId: 1, id: 1, title: 'delectus aut autem', completed: false })),
    http.get(urlError, () => HttpResponse.text('Unauthorized', { status: 401, statusText: 'Unauthorized' })),
    http.get(urlEmpty, () => new HttpResponse()),
    http.get(urlNoContentType, () => HttpResponse.text('Hello, world!', { headers: { 'Content-Length': '13', 'Content-Type': '' } })),
    http.get(urlNoContentLength, () => HttpResponse.text('Hello, world!', { headers: { 'Content-Type': 'text/plain', 'Content-Length': '' } })),
  )

  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
    server.listen()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
    server.close()
  })

  it('should upload the file from the URL to the storage pool', async({ moduleStorage }) => {
    const entity = await uploadFromUrl.call(moduleStorage, urlOk, { pool: 'default' })
    const result = await download.call(moduleStorage, entity)
    const data = await result.getText()
    expect(data).toBe('{"userId":1,"id":1,"title":"delectus aut autem","completed":false}')
    expect(entity).toBeInstanceOf(StorageFile)
    expect(entity).toMatchObject({
      id: expect.stringMatching(EXP_UUID),
      name: '/todos/1',
      pool: 'default',
      size: 66,
      type: 'application/json',
      origin: 'https://jsonplaceholder.typicode.com',
      hash: 'bd74e2ac0e31485fdde81fe9d4ce99c42debd8c0dbe8f56833cea90f3e1e1377',
      assignments: undefined,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      deletedAt: undefined,
    })
  })

  it('should throw if the pool does not exist', async({ moduleStorage }) => {
    const shouldReject = uploadFromUrl.call(moduleStorage, urlOk, { pool: 'non-existent-pool' })
    const error = ERRORS.STORAGE_POOL_NOT_FOUND('non-existent-pool')
    await expect(shouldReject).rejects.toThrow(error)
  })

  it('should throw an error if the URL cannot be fetched', async({ moduleStorage }) => {
    const shouldReject = uploadFromUrl.call(moduleStorage, urlError, { pool: 'default' })
    const error = ERRORS.STORAGE_UPLOAD_FROM_URL_FAILED('Unauthorized')
    await expect(shouldReject).rejects.toThrow(error)
  })

  it('should throw an error if the response body is empty', async({ moduleStorage }) => {
    const shouldReject = uploadFromUrl.call(moduleStorage, urlEmpty, { pool: 'default' })
    const error = ERRORS.STORAGE_UPLOAD_FROM_URL_EMPTY_BODY()
    await expect(shouldReject).rejects.toThrow(error)
  })

  it('should throw an error if the content type is missing', async({ moduleStorage }) => {
    const shouldReject = uploadFromUrl.call(moduleStorage, urlNoContentType, { pool: 'default' })
    const error = ERRORS.STORAGE_UPLOAD_FROM_URL_NO_CONTENT_TYPE()
    await expect(shouldReject).rejects.toThrow(error)
  })

  it('should throw an error if the content length is missing', async({ moduleStorage }) => {
    const shouldReject = uploadFromUrl.call(moduleStorage, urlNoContentLength, { pool: 'default' })
    const error = ERRORS.STORAGE_UPLOAD_FROM_URL_NO_CONTENT_LENGTH()
    await expect(shouldReject).rejects.toThrow(error)
  })
})
