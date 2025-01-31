import { deserializeReadableStream } from './deserializeReadableStream'
import { serializeReadableStream } from './serializeReadableStream.mjs'

function createStream(text: string, chunkSize = text.length): ReadableStream<string> {
  return new ReadableStream({
    start(controller) {
      for (let i = 0; i < text.length; i += chunkSize) {
        const chunk = text.slice(i, i + chunkSize)
        controller.enqueue(chunk)
      }
      controller.close()
    },
  })
}

describe('deserializeReadableStream', () => {
  describe('ReadableStream', () => {
    it('should return a ReadableStream instance', () => {
      const stream = new ReadableStream()
      const serialized = serializeReadableStream(stream)
      const deserialized = deserializeReadableStream(serialized)
      expect(deserialized).toBeInstanceOf(ReadableStream)
    })

    it('should not be the same instance', () => {
      const stream = new ReadableStream()
      const serialized = serializeReadableStream(stream)
      const deserialized = deserializeReadableStream(serialized)
      expect(deserialized).not.toBe(stream)
    })
  })

  describe('read', () => {
    it('should deserialize a serialized ReadableStream object', async() => {
      const stream = createStream('Hello, world!')
      const serialized = serializeReadableStream(stream)
      const deserialized = deserializeReadableStream(serialized)
      const reader = deserialized.getReader()
      const result = await reader.read()
      expect(result).toEqual({ done: false, value: 'Hello, world!' })
    })

    it('should handle the "end" event correctly', async() => {
      const stream = createStream('Hello, world!')
      const serialized = serializeReadableStream(stream)
      const deserialized = deserializeReadableStream(serialized)
      const reader = deserialized.getReader()
      await reader.read()
      const result = await reader.read()
      expect(result).toEqual({ done: true, value: undefined })
    })

    it('should close the port when the stream is done', async() => {
      const stream = createStream('Hello, world!')
      const serialized = serializeReadableStream(stream)
      const deserialized = deserializeReadableStream(serialized)
      const reader = deserialized.getReader()
      const callback = vi.fn()
      serialized.port.on('close', callback)
      await reader.read()
      await reader.read()
      await new Promise(resolve => setTimeout(resolve, 1))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should close the port when the stream is canceled', async() => {
      const stream = createStream('Hello, world!')
      const serialized = serializeReadableStream(stream)
      const deserialized = deserializeReadableStream(serialized)
      const reader = deserialized.getReader()
      const callback = vi.fn()
      serialized.port.on('close', callback)
      await reader.cancel()
      await new Promise(resolve => setTimeout(resolve, 1))
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('error handling', () => {
    it('should handle the "error" event correctly', async() => {
      const stream = new ReadableStream({
        start(controller) {
          controller.error(new Error('Oops!'))
        },
      })
      const serialized = serializeReadableStream(stream)
      const deserialized = deserializeReadableStream(serialized)
      const reader = deserialized.getReader()
      const shouldReject = reader.read()
      await expect(shouldReject).rejects.toThrow('Oops!')
    })

    it('should close the port when the stream is errored', async() => {
      const stream = new ReadableStream({
        start(controller) {
          controller.error(new Error('Oops!'))
        },
      })
      const serialized = serializeReadableStream(stream)
      const deserialized = deserializeReadableStream(serialized)
      const reader = deserialized.getReader()
      const callback = vi.fn()
      serialized.port.on('close', callback)
      const shouldReject = reader.read()
      await expect(shouldReject).rejects.toThrow('Oops!')
      await new Promise(resolve => setTimeout(resolve, 1))
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})
