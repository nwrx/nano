/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable sonarjs/no-unused-vars */
/* eslint-disable sonarjs/no-dead-store */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/no-process-exit */
/* eslint-disable n/no-process-exit */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable unicorn/prefer-module */
import type { Function } from '@unshared/types'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { addNode, createThread } from '../thread'
import { defineComponent, ERRORS as E } from '../utils'
import { processInSandbox } from './processInSandbox'

function createContext(fn: Function | string) {
  const thread = createThread()
  let process = () => {}
  if (typeof fn === 'string')
    process.toString = () => fn
  else process = fn
  const component = defineComponent({}, fn as any)
  const nodeId = addNode(thread, 'example', { component })
  return { thread, nodeId, component }
}

describe('processInSandbox', { retry: 3 }, () => {
  describe('process', () => {
    it('should call the process function of a component in a VM', async() => {
      const { thread, nodeId } = createContext(() => ({ value: 'Hello, World!' }))
      const result = await processInSandbox(thread, nodeId)
      expect(result).toStrictEqual({ value: 'Hello, World!' })
    })

    it('should not call the process function in the main thread', async() => {
      const fn = vi.fn(() => ({ value: 'Hello, World!' }))
      fn.toString = () => 'function () { return { value: "Hello, World!" } }'
      const { thread, nodeId } = createContext(fn)
      const result = await processInSandbox(thread, nodeId)
      expect(result).toStrictEqual({ value: 'Hello, World!' })
      expect(fn).not.toHaveBeenCalled()
    })

    it('should return the result of a promise', async() => {
      const { thread, nodeId } = createContext(() => Promise.resolve({ value: 'Hello, World!' }))
      const result = await processInSandbox(thread, nodeId)
      expect(result).toStrictEqual({ value: 'Hello, World!' })
    })

    it('should use the data passed to the process function', async() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const { thread, nodeId } = createContext(({ data }) => ({ value: `Hello, ${data.name}!` }))
      const result = await processInSandbox(thread, nodeId, { name: 'World' })
      expect(result).toStrictEqual({ value: 'Hello, World!' })
    })
  })

  describe('errors', () => {
    it('should throw an error if the process throws an error', async() => {
      const { thread, nodeId } = createContext(() => { throw new Error('An error occurred') })
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError('An error occurred')
    })

    it('should throw an error if the process throws a promise rejection', async() => {
      const { thread, nodeId } = createContext(() => Promise.reject(new Error('An error occurred')))
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError('An error occurred')
    })
  })

  describe('abort', () => {
    it('should dispose the isolate when the abort signal is triggered', async() => {
      const { thread, nodeId } = createContext(() => new Promise(() => {}))
      const shouldReject = processInSandbox(thread, nodeId)
      await new Promise(resolve => setTimeout(resolve, 10))
      thread.abortController.abort()
      const error = E.ISOLATED_VM_DISPOSED()
      await expect(shouldReject).rejects.toThrowError(error)
    })
  })

  describe('exposed apis', () => {
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

    it('should have access to fetch', async() => {
      const fn = () => fetch('https://jsonplaceholder.typicode.com/todos/1').then(response => response.ok)
      const { thread, nodeId } = createContext(fn)
      const result = await processInSandbox(thread, nodeId)
      expect(result).toStrictEqual(true)
    })
  })

  describe('isolation', () => {
    it('should only expose the provided global properties', async() => {
      const { thread, nodeId } = createContext(() => Object.keys(globalThis))
      const result = await processInSandbox(thread, nodeId)
      expect(result).toStrictEqual(['fetchImpl'])
    })

    it('should throw an error when trying to require a module', async() => {
      const { thread, nodeId } = createContext(() => require('node:fs'))
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError('require is not defined')
    })

    it('should throw an error when trying to import a module', async() => {
      const { thread, nodeId } = createContext( 'function () { return import(\'node:fs\') }')
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError('Not supported')
    })

    it('should throw when trying to access import', async() => {
      const { thread, nodeId } = createContext('function () { return import }')
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError(/^Cannot use import statement outside a module/)
    })

    it('should throw when trying to access garbage collector', async() => {
      const { thread, nodeId } = createContext(() => gc)
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError('gc is not defined')
    })

    it('should throw when trying to access import.meta', async() => {
      const { thread, nodeId } = createContext('(function () { return import.meta })')
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError(/^Cannot use 'import.meta' outside a module/)
    })

    it('should throw when trying to export a module', async() => {
      const { thread, nodeId } = createContext('export default 42')
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError(/^Unexpected token 'export'/)
    })

    it('should throw an error when trying to access the process object', async() => {
      const { thread, nodeId } = createContext(() => process.exit(0))
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError('process is not defined')
    })

    it('should throw an error when trying to access the environment variables', async() => {
      const { thread, nodeId } = createContext(() => process.env)
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError('process is not defined')
    })

    it('should not allow network access', async() => {
      const { thread, nodeId } = createContext(() => new XMLHttpRequest())
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError('XMLHttpRequest is not defined')
    })
  })

  describe('security', () => {
    it('should not allow access to global variables via constructor trick', async() => {
      const sauce = 'sauce'
      const { thread, nodeId } = createContext('(this.constructor.constructor("return sauce"))()')
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError('sauce is not defined')
    })

    it('should not allow access to global variables via Proxy setter', async() => {
      const sauce = 'sauce'
      const { thread, nodeId } = createContext(`() => {
        const proxy = new Proxy({}, {
          set: function(me, key, value) { (value.constructor.constructor('console.log(sauce)'))() }
        })
        proxy.sauce = 'sauce'
      }`)
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError('sauce is not defined')
    })

    it('should not allow access to global variables via Proxy getter', async() => {
      const sauce = 'sauce'
      const { thread, nodeId } = createContext(`() => {
        const proxy = new Proxy({}, {
          get: function(me, key) { (arguments.callee.caller.constructor('console.log(sauce)'))() }
        })
        return proxy.sauce
      }`)
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError('sauce is not defined')
    })

    it('should not allow access to global variables via exception proxy', async() => {
      const { thread, nodeId } = createContext(`() => {
        const proxy = new Proxy({}, {
          get(me, key) {
            const cc = arguments.callee.caller
            if (cc != null)
              (cc.constructor.constructor('console.log(sauce)'))()
            return me[key]
          },
        } )
        throw proxy
      }`)
      const shouldReject = processInSandbox(thread, nodeId)
      await expect(shouldReject).rejects.toThrowError('An object was thrown from supplied code within isolated-vm, but that object was not an instance of `Error`.')
    })
  })
})
