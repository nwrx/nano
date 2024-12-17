/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { implementFetch } from './implementFetch'
import { implementHeaders } from './implementHeaders'
import { wrapInSandbox } from './wrapInSandbox'

describe('implementFetch', () => {
  const url = 'https://jsonplaceholder.typicode.com/todos/1'
  const data = { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
  const handler = http.get(url, () => HttpResponse.json(data))
  const server = setupServer(handler)

  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.close()
  })

  describe('response', () => {
    it('should return a response with the "ok" property set to true', async() => {
      const wrapped = await wrapInSandbox((url: string) => fetch(url).then(response => response.ok))
      await implementHeaders(wrapped.isolate, wrapped.context)
      await implementFetch(wrapped.isolate, wrapped.context)
      const result = await wrapped(url)
      expect(result).toStrictEqual(true)
    })

    it('should return a response with the "url" property set to the requested URL', async() => {
      const wrapped = await wrapInSandbox((url: string) => fetch(url).then(response => response.url))
      await implementHeaders(wrapped.isolate, wrapped.context)
      await implementFetch(wrapped.isolate, wrapped.context)
      const result = await wrapped(url)
      expect(result).toStrictEqual(url)
    })

    it('should return a response with the "type" property set to "basic"', async() => {
      const wrapped = await wrapInSandbox((url: string) => fetch(url).then(response => response.type))
      await implementHeaders(wrapped.isolate, wrapped.context)
      await implementFetch(wrapped.isolate, wrapped.context)
      const result = await wrapped(url)
      expect(result).toStrictEqual('default')
    })

    it('should return a response with the "status" property set to 200', async() => {
      const wrapped = await wrapInSandbox((url: string) => fetch(url).then(response => response.status))
      await implementHeaders(wrapped.isolate, wrapped.context)
      await implementFetch(wrapped.isolate, wrapped.context)
      const result = await wrapped(url)
      expect(result).toStrictEqual(200)
    })

    it('should return a response with the "statusText" property set to "OK"', async() => {
      const wrapped = await wrapInSandbox((url: string) => fetch(url).then(response => response.statusText))
      await implementHeaders(wrapped.isolate, wrapped.context)
      await implementFetch(wrapped.isolate, wrapped.context)
      const result = await wrapped(url)
      expect(result).toStrictEqual('OK')
    })

    it('should return a response with the "redirected" property set to false', async() => {
      const wrapped = await wrapInSandbox((url: string) => fetch(url).then(response => response.redirected))
      await implementHeaders(wrapped.isolate, wrapped.context)
      await implementFetch(wrapped.isolate, wrapped.context)
      const result = await wrapped(url)
      expect(result).toStrictEqual(false)
    })
  })

  describe('headers', () => {
    it('should return a response with the "headers" property set to a Headers object', async() => {
      const wrapped = await wrapInSandbox((url: string) => fetch(url).then(response => response.headers.constructor.name))
      await implementHeaders(wrapped.isolate, wrapped.context)
      await implementFetch(wrapped.isolate, wrapped.context)
      const result = await wrapped(url)
      expect(result).toEqual('Headers')
    })

    it('should get the "Content-Type" header from the response', async() => {
      const wrapped = await wrapInSandbox((url: string) => fetch(url).then(response => response.headers.get('Content-Type')))
      await implementHeaders(wrapped.isolate, wrapped.context)
      await implementFetch(wrapped.isolate, wrapped.context)
      const result = await wrapped(url)
      expect(result).toEqual('application/json')
    })
  })

  describe('response.body', () => {
    it('should return the response body as a text', async() => {
      const wrapped = await wrapInSandbox((url: string) => fetch(url).then(response => response.text()))
      await implementHeaders(wrapped.isolate, wrapped.context)
      await implementFetch(wrapped.isolate, wrapped.context)
      const result = await wrapped('https://jsonplaceholder.typicode.com/todos/1')
      expect(result).toStrictEqual('{"userId":1,"id":1,"title":"delectus aut autem","completed":false}')
    })

    it('should return the response body as a JSON object', async() => {
      const wrapped = await wrapInSandbox((url: string) => fetch(url).then(response => response.json()))
      await implementHeaders(wrapped.isolate, wrapped.context)
      await implementFetch(wrapped.isolate, wrapped.context)
      const result = await wrapped('https://jsonplaceholder.typicode.com/todos/1') as Record<string, unknown>
      expect(result).toStrictEqual({ userId: 1, id: 1, title: 'delectus aut autem', completed: false })
    })

    it('should return a response with the "bodyUsed" property set to false', async() => {
      const wrapped = await wrapInSandbox((url: string) => fetch(url).then(response => response.bodyUsed))
      await implementHeaders(wrapped.isolate, wrapped.context)
      await implementFetch(wrapped.isolate, wrapped.context)
      const result = await wrapped('https://jsonplaceholder.typicode.com/todos/1')
      expect(result).toStrictEqual(false)
    })

    it('should return a response with the "bodyUsed" property set to true after reading the body', async() => {
      const wrapped = await wrapInSandbox((url: string) => fetch(url).then(response => response.text().then(() => response.bodyUsed)))
      await implementHeaders(wrapped.isolate, wrapped.context)
      await implementFetch(wrapped.isolate, wrapped.context)
      const result = await wrapped('https://jsonplaceholder.typicode.com/todos/1')
      expect(result).toStrictEqual(true)
    })
  })

  describe.todo.concurrent('requestInit', () => {})
})
