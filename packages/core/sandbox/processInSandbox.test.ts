/* eslint-disable sonarjs/no-unused-vars */
/* eslint-disable sonarjs/no-dead-store */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unicorn/no-process-exit */
/* eslint-disable n/no-process-exit */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable unicorn/prefer-module */
import type { Function } from '@unshared/types'
import { ERRORS as E } from '../utils'
import { processInSandbox } from './processInSandbox'

describe('processInSandbox', () => {
  describe('process', () => {
    it('should call the process function of a component in a VM', async() => {
      // @ts-expect-error: ignore missing context properties.
      const result = await processInSandbox(() => ({ value: 'Hello, World!' }), {})
      expect(result).toStrictEqual({ value: 'Hello, World!' })
    })

    it('should not call the process function in the main thread', async() => {
      const fn = vi.fn(() => ({ value: 'Hello, World!' }))
      fn.toString = () => 'function () { return { value: "Hello, World!" } }'
      // @ts-expect-error: ignore missing context properties.
      const result = await processInSandbox(fn, {})
      expect(result).toStrictEqual({ value: 'Hello, World!' })
      expect(fn).not.toHaveBeenCalled()
    })

    it('should return the result of a promise', async() => {
      // @ts-expect-error: ignore missing context properties.
      const result = await processInSandbox(() => Promise.resolve({ value: 'Hello, World!' }), {})
      expect(result).toStrictEqual({ value: 'Hello, World!' })
    })

    it('should use the data passed to the process function', async() => {
      // @ts-expect-error: ignore missing context properties.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const result = await processInSandbox(({ data }) => ({ value: `Hello, ${data.name}!` }), { data: { name: 'World' } })
      expect(result).toStrictEqual({ value: 'Hello, World!' })
    })

    it('should use the result passed to the process function', async() => {
      // @ts-expect-error: ignore missing context properties.
      const result = await processInSandbox(() => ({ value: 'Hello, World!' }), { result: { value: 'Hello, Universe!' } })
      expect(result).toStrictEqual({ value: 'Hello, World!' })
    })

    it('should call the "askConfirmation" function passed to the process function', async() => {
      const fn = ({ askConfirmation }: { askConfirmation: Function }) => { askConfirmation({ message: 'Hello, World !' }); return {} }
      const askConfirmation = vi.fn()
      // @ts-expect-error: ignore missing context properties.
      await processInSandbox(fn, { askConfirmation })
      expect(askConfirmation).toHaveBeenCalledWith({ message: 'Hello, World !' })
    })

    it('should call the "askQuestion" function passed to the process function', async() => {
      const fn = ({ askQuestion }: { askQuestion: Function }) => { askQuestion({ message: 'Hello, World !' }); return {} }
      const askQuestion = vi.fn()
      // @ts-expect-error: ignore missing context properties.
      await processInSandbox(fn, { askQuestion })
      expect(askQuestion).toHaveBeenCalledWith({ message: 'Hello, World !' })
    })

    it('should call the "askConfirmation" function passed to the process function with the correct options', async() => {
      const fn = ({ askConfirmation }: { askConfirmation: Function }) => { askConfirmation({ message: 'Hello, World !' }); return {} }
      const askConfirmation = vi.fn()
      // @ts-expect-error: ignore missing context properties.
      await processInSandbox(fn, { askConfirmation })
      expect(askConfirmation).toHaveBeenCalledWith({ message: 'Hello, World !' })
    })
  })

  describe('errors', () => {
    it('should throw an error if the process throws an error', async() => {
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox(() => { throw new Error('An error occurred') }, {})
      await expect(shouldReject).rejects.toThrowError('An error occurred')
    })

    it('should throw an error if the process throws a promise rejection', async() => {
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox(() => Promise.reject(new Error('An error occurred')), {})
      await expect(shouldReject).rejects.toThrowError('An error occurred')
    })
  })

  describe('abort', () => {
    it('should dispose the isolate when the abort signal is triggered', async() => {
      const fn = () => new Promise(() => {})
      const abortController = new AbortController()
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox(fn, { abortSignal: abortController.signal })
      await new Promise(resolve => setTimeout(resolve, 10))
      abortController.abort()
      const error = E.ISOLATED_VM_DISPOSED()
      await expect(shouldReject).rejects.toThrowError(error)
    })
  })

  describe('exposed apis', () => {
    it('should have access to fetch', async() => {
      const fn = () => fetch('https://jsonplaceholder.typicode.com/todos/1').then(response => response.ok)
      // @ts-expect-error: ignore missing context properties.
      const result = await processInSandbox(fn, {})
      expect(result).toStrictEqual(true)
    })
  }, 1000)

  describe('isolation', () => {
    it('should only expose the provided global properties', async() => {
      // @ts-expect-error: ignore missing context properties.
      const result = await processInSandbox(() => Object.keys(globalThis), {})
      expect(result).toStrictEqual(['fetchImpl'])
    })

    it('should throw an error when trying to require a module', async() => {
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox(() => require('node:fs'), {})
      await expect(shouldReject).rejects.toThrowError('require is not defined')
    })

    it('should throw an error when trying to import a module', async() => {
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox('() => import(\'node:fs\')', {})
      await expect(shouldReject).rejects.toThrowError('Not supported')
    })

    it('should throw when trying to access import', async() => {
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox('() => import', {})
      await expect(shouldReject).rejects.toThrowError(/^Cannot use import statement outside a module/)
    })

    it('should throw when trying to access garbage collector', async() => {
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox('() => gc', {})
      await expect(shouldReject).rejects.toThrowError('gc is not defined')
    })

    it('should throw when trying to access import.meta', async() => {
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox('() => import.meta', {})
      await expect(shouldReject).rejects.toThrowError(/^Cannot use 'import.meta' outside a module/)
    })

    it('should throw when trying to export a module', async() => {
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox('() => export default 42', {})
      await expect(shouldReject).rejects.toThrowError(/^Unexpected token 'export'/)
    })

    it('should throw an error when trying to access the process object', async() => {
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox(() => process.exit(0), {})
      await expect(shouldReject).rejects.toThrowError('process is not defined')
    })

    it('should throw an error when trying to access the environment variables', async() => {
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox(() => process.env, {})
      await expect(shouldReject).rejects.toThrowError('process is not defined')
    })

    it('should throw an error when trying to access a global object', async() => {
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox(() => AbortController, {})
      await expect(shouldReject).rejects.toThrowError('AbortController is not defined')
    })

    it('should not allow network access', async() => {
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox(() => new XMLHttpRequest(), {})
      await expect(shouldReject).rejects.toThrowError('XMLHttpRequest is not defined')
    })
  })

  describe('security', () => {
    it('should not allow access to global variables via constructor trick', async() => {
      const sauce = 'sauce'
      const code = '(this.constructor.constructor("return sauce"))()'
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox(code, {})
      await expect(shouldReject).rejects.toThrowError('sauce is not defined')
    })

    it('should not allow access to global variables via Proxy setter', async() => {
      const sauce = 'sauce'
      const code = `() => {
        const proxy = new Proxy({}, {
          set: function(me, key, value) { (value.constructor.constructor('console.log(sauce)'))() }
        })
        proxy.sauce = 'sauce'
      }`
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox(code, {})
      await expect(shouldReject).rejects.toThrowError('sauce is not defined')
    })

    it('should not allow access to global variables via Proxy getter', async() => {
      const sauce = 'sauce'
      const code = `() => {
        const proxy = new Proxy({}, {
          get: function(me, key) { (arguments.callee.caller.constructor('console.log(sauce)'))() }
        })
        return proxy.sauce
      }`
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox(code, {})
      await expect(shouldReject).rejects.toThrowError('sauce is not defined')
    })

    it('should not allow access to global variables via exception proxy', async() => {
      const code = `() => {
        const proxy = new Proxy({}, {
          get(me, key) {
            const cc = arguments.callee.caller
            if (cc != null)
              (cc.constructor.constructor('console.log(sauce)'))()
            return me[key]
          },
        } )
        throw proxy
      }`
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInSandbox(code, {})
      await expect(shouldReject).rejects.toThrowError('An object was thrown from supplied code within isolated-vm, but that object was not an instance of `Error`.')
    })
  })
})
