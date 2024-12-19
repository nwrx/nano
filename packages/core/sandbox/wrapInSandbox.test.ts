import ivm from 'isolated-vm'
import { wrapInSandbox } from './wrapInSandbox'

describe('wrapInSandbox', () => {
  describe('function', () => {
    it('should call the function in a sandboxed environment', async() => {
      const callback = vi.fn(() => 'Hello, World!')
      callback.toString = () => 'function () { return "Hello, World!" }'
      const wrapped = await wrapInSandbox(callback)
      const result = await wrapped()
      expect(callback).not.toHaveBeenCalled()
      expect(result).toStrictEqual('Hello, World!')
    })

    it('should call a string script in a sandboxed environment', async() => {
      const wrapped = await wrapInSandbox<() => string>('() => "Hello, World!"')
      const result = await wrapped()
      expect(result).toStrictEqual('Hello, World!')
    })
  })

  describe('properties', () => {
    it('should pass string parameters to the function', async() => {
      const wrapped = await wrapInSandbox((name: string) => `Hello, ${name}!`)
      const result = await wrapped('World')
      expect(result).toStrictEqual('Hello, World!')
    })

    it('should pass number parameters to the function', async() => {
      const wrapped = await wrapInSandbox((n: number) => n * 2)
      const result = await wrapped(21)
      expect(result).toStrictEqual(42)
    })

    it('should pass object parameters to the function', async() => {
      const wrapped = await wrapInSandbox((object: { name: string }) => `Hello, ${object.name}!`)
      const result = await wrapped({ name: 'World' })
      expect(result).toStrictEqual('Hello, World!')
    })

    it('should pass array parameters to the function', async() => {
      const wrapped = await wrapInSandbox((array: string[]) => array.join(', '))
      const result = await wrapped(['Hello', 'World'])
      expect(result).toStrictEqual('Hello, World')
    })
  })

  describe('extra properties', () => {
    it('should expose the "isolate" property', async() => {
      const wrapped = await wrapInSandbox(() => 'Hello, World!')
      expect(wrapped.isolate).toBeInstanceOf(ivm.Isolate)
    })

    it('should expose the "context" property', async() => {
      const wrapped = await wrapInSandbox(() => 'Hello, World!')
      expect(wrapped.context).toBeInstanceOf(ivm.Context)
    })
  })

  describe('primitive result', () => {
    it('should return the string "Hello, World!"', async() => {
      const wrapped = await wrapInSandbox(() => 'Hello, World!')
      const result = await wrapped()
      expect(result).toStrictEqual('Hello, World!')
    })

    it('should return the number 42', async() => {
      const wrapped = await wrapInSandbox(() => 42)
      const result = await wrapped()
      expect(result).toStrictEqual(42)
    })

    it('should return a proxy of an object', async() => {
      const wrapped = await wrapInSandbox(() => ({ hello: 'world' }))
      const result = await wrapped()
      expect(result.hello).toStrictEqual('world')
    })
  })

  describe('promise result', () => {
    it('should return a promise that resolves to "Hello, World!"', async() => {
      const wrapped = await wrapInSandbox(() => Promise.resolve('Hello, World!'))
      const result = await wrapped()
      expect(result).toStrictEqual('Hello, World!')
    })

    it('should return a promise that resolves to 42', async() => {
      const wrapped = await wrapInSandbox(() => Promise.resolve(42))
      const result = await wrapped()
      expect(result).toStrictEqual(42)
    })

    it('should return a promise that resolves to a proxy of an object', async() => {
      const wrapped = await wrapInSandbox(() => Promise.resolve({ hello: 'world' }))
      const result = await wrapped()
      expect(result.hello).toStrictEqual('world')
    })
  })

  describe('complex result', () => {
    it('should return a function that returns 42', async() => {
      const wrapped = await wrapInSandbox(() => () => 42)
      const fn = await wrapped()
      const result = await fn()
      expect(result).toStrictEqual(42)
    })

    it('should return a function that resolves to 42', async() => {
      const wrapped = await wrapInSandbox(() => () => Promise.resolve(42))
      const fn = await wrapped()
      const result = await fn()
      expect(result).toStrictEqual(42)
    })

    it('should return a function that returns a object that contains a function that returns 42', async() => {
      const wrapped = await wrapInSandbox(() => () => ({ getNumber: () => 42 }))
      const fn = await wrapped()
      const result = await fn()
      expect(result.getNumber()).toStrictEqual(42)
    })
  })

  describe('error handling', () => {
    it('should return an error when the function throws an error', async() => {
      const wrapped = await wrapInSandbox<() => void>(() => { throw new Error('Hello, World!') })
      const error = await wrapped().catch((error: Error) => error)
      expect(error).toBeInstanceOf(Error)
    })

    it('should pass the error message to the Error instance', async() => {
      const wrapped = await wrapInSandbox<() => void>(() => { throw new Error('Hello, World!') })
      const error = await wrapped().catch((error: Error) => error)
      expect(error!.message).toStrictEqual('Hello, World!')
    })

    it('should pass the error stack to the Error instance', async() => {
      const wrapped = await wrapInSandbox<() => void>(() => { throw new Error('Hello, World!') })
      const error = await wrapped().catch((error: Error) => error)
      expect(error!.stack).toContain('Error: Hello, World!')
    })

    it('should pass the error name to the Error instance', async() => {
      const wrapped = await wrapInSandbox<() => void>(() => { throw new TypeError('Hello, World!') })
      const error = await wrapped().catch((error: Error) => error)
      expect(error!.name).toStrictEqual('TypeError')
    })

    it('should throw an error when the function throws an error that is not an instance of Error', async() => {
      const wrapped = await wrapInSandbox<() => void>('() => { throw new Object() }')
      const error = await wrapped().catch((error: Error) => error)
      expect(error!.message).toStrictEqual('An object was thrown from supplied code within isolated-vm, but that object was not an instance of `Error`.')
    })
  })
})
