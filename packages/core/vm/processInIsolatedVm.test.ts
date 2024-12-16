/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable unicorn/prefer-module */
import { createThread } from '../thread'
import { defineComponent } from '../utils'
import { processInIsolatedVm } from './processInIsolatedVm'

describe('processInIsolatedVm', () => {
  describe('process', () => {
    it('should call the process function of a component in a VM', async() => {
      const thread = createThread()
      const component = defineComponent({}, () => ({ value: 'Hello, World!' }))
      // @ts-expect-error: ignore missing context properties.
      const result = await processInIsolatedVm(thread, component, {})
      expect(result).toEqual({ value: 'Hello, World!' })
    })

    it('should return the result of a promise', async() => {
      const thread = createThread()
      const component = defineComponent({}, () => Promise.resolve({ value: 'Hello, World!' }))
      // @ts-expect-error: ignore missing context properties.
      const result = await processInIsolatedVm(thread, component, {})
      expect(result).toEqual({ value: 'Hello, World!' })
    })

    it('should use the data passed to the process function', async() => {
      const thread = createThread()
      const component = defineComponent({ inputs: { name: { type: 'string' } } }, ({ data }) => ({ value: `Hello, ${data.name}!` }))
      // @ts-expect-error: ignore missing context properties.
      const result = await processInIsolatedVm(thread, component, { data: { name: 'World' } })
      expect(result).toEqual({ value: 'Hello, World!' })
    })

    it('should use the result passed to the process function', async() => {
      const thread = createThread()
      const component = defineComponent({}, () => ({ value: 'Hello, World!' }))
      // @ts-expect-error: ignore missing context properties.
      const result = await processInIsolatedVm(thread, component, { result: { value: 'Hello, Universe!' } })
      expect(result).toEqual({ value: 'Hello, World!' })
    })

    it('should call the trace function passed to the process function', async() => {
      const thread = createThread()
      const component = defineComponent({}, ({ trace }) => { trace({ message: 'Hello, World !' }); return {} })
      const trace = vi.fn()
      // @ts-expect-error: ignore missing context properties.
      await processInIsolatedVm(thread, component, { trace })
      expect(trace).toHaveBeenCalledWith({ message: 'Hello, World !' })
    })
  })

  describe('errors', () => {
    it('should throw an error if the process throws an error', async() => {
      const thread = createThread()
      const component = defineComponent({}, () => { throw new Error('An error occurred') })
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInIsolatedVm(thread, component, {})
      await expect(shouldReject).rejects.toThrowError('An error occurred')
    })

    it('should throw an error if the process throws a promise rejection', async() => {
      const thread = createThread()
      const component = defineComponent({}, () => Promise.reject(new Error('An error occurred')))
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInIsolatedVm(thread, component, {})
      await expect(shouldReject).rejects.toThrowError('An error occurred')
    })
  })

  describe('stream', () => {
    it('should accept stream in the properties of the data object', async() => {
      const thread = createThread()
      const component = defineComponent(
        {
          inputs: { stream: { 'x-stream': true } },
          outputs: { text: { type: 'string' } },
        },
        async({ data }) => {
          const chunks = []
          const reader = data.stream.getReader()
          const decoder = new TextDecoder('utf8')
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            chunks.push(decoder.decode(value))
          }
          return {
            text: chunks.join(''),
          }
        },
      )

      // --- Create a `ReadableStream` that will output 'Hello, World!' in chunks.
      const encoder = new TextEncoder()
      const text = 'Hello, Universe!'
      const stream = new ReadableStream({
        async start(controller) {
          const chunkSize = 4
          for (let i = 0; i < text.length; i += chunkSize) {
            const chunk = text.slice(i, i + chunkSize)
            controller.enqueue(encoder.encode(chunk))
            await new Promise(resolve => setTimeout(resolve, 10))
          }
          controller.close()
        },
      })

      // @ts-expect-error: ignore missing context properties.
      const result = await processInIsolatedVm(thread, component, { data: { stream } })
      expect(result).toEqual({ text: 'Hello, Universe!' })
    })
  })

  describe('isolation', () => {
    it('should throw an error when trying to access the global object', async() => {
      const thread = createThread()
      const component = defineComponent({}, () => globalThis.fetch('https://example.com'))
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInIsolatedVm(thread, component, {})
      await expect(shouldReject).rejects.toThrowError('globalThis.fetch is not a function')
    })

    it('should throw an error when trying to require a module', async() => {
      const thread = createThread()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const component = defineComponent({}, () => require('node:fs'))
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInIsolatedVm(thread, component, {})
      await expect(shouldReject).rejects.toThrowError('require is not defined')
    })

    it('should throw an error when trying to access the process object', async() => {
      const thread = createThread()
      // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
      const component = defineComponent({}, () => process.exit(0))
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInIsolatedVm(thread, component, {})
      await expect(shouldReject).rejects.toThrowError('process is not defined')
    })

    it('should throw an error when trying to access the module object', async() => {
      const thread = createThread()
      const component = defineComponent({}, () => module)
      // @ts-expect-error: ignore missing context properties.
      const shouldReject = processInIsolatedVm(thread, component, {})
      await expect(shouldReject).rejects.toThrowError('module is not defined')
    })
  })
})
