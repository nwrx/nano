/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MessagePort } from 'node:worker_threads'
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

describe('serializeReadableStream', () => {
  it('should return an object with a `@instanceOf` property set to `ReadableStream`', () => {
    const stream = createStream('Hello, world!')
    const serialized = serializeReadableStream(stream)
    expect(serialized).toEqual({
      '@instanceOf': 'ReadableStream',
      'port': expect.any(MessagePort),
    })
  })

  it('should emit the "data" event when sending the "read" event', async() => {
    const stream = createStream('Hello, world!')
    const serialized = serializeReadableStream(stream)
    const callback = vi.fn()
    serialized.port.on('message', callback)
    serialized.port.postMessage('read')
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith({ event: 'data', value: 'Hello, world!' })
  })

  it('should emit the "end" event when sending the last "read" event', async() => {
    const stream = createStream('Hello, world!')
    const serialized = serializeReadableStream(stream)
    const callback = vi.fn()
    serialized.port.on('message', callback)
    serialized.port.postMessage('read')
    await new Promise(resolve => setTimeout(resolve, 1))
    serialized.port.postMessage('read')
    await new Promise(resolve => setTimeout(resolve, 1))
    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenNthCalledWith(1, { event: 'data', value: 'Hello, world!' })
    expect(callback).toHaveBeenNthCalledWith(2, { event: 'end' })
  })

  it('should emit the "data" event until the "end" event is sent', async() => {
    const stream = createStream('Hello, world!', 5)
    const serialized = serializeReadableStream(stream)
    const callback = vi.fn()
    serialized.port.on('message', callback)
    serialized.port.postMessage('read')
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 1))
      serialized.port.postMessage('read')
    }
    expect(callback).toHaveBeenCalledTimes(5)
    expect(callback).toHaveBeenNthCalledWith(1, { event: 'data', value: 'Hello' })
    expect(callback).toHaveBeenNthCalledWith(2, { event: 'data', value: ', wor' })
    expect(callback).toHaveBeenNthCalledWith(3, { event: 'data', value: 'ld!' })
    expect(callback).toHaveBeenNthCalledWith(4, { event: 'end' })
  })

  it('should send the "end" event when the stream is already canceled', async() => {
    const stream = new ReadableStream()
    await stream.cancel()
    const serialized = serializeReadableStream(stream)
    const callback = vi.fn()
    serialized.port.on('message', callback)
    serialized.port.postMessage('read')
    await new Promise(resolve => setTimeout(resolve, 1))
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith({ event: 'end' })
  })

  it('should send the "error" event when the stream throws an error', async() => {
    const stream = new ReadableStream({
      start(controller) {
        controller.error(new Error('Oops!'))
      },
    })
    const serialized = serializeReadableStream(stream)
    const callback = vi.fn()
    serialized.port.on('message', callback)
    serialized.port.postMessage('read')
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith({
      event: 'error',
      error: expect.objectContaining({
        '@instanceOf': 'Error',
        'name': 'Error',
        'message': 'Oops!',
      }),
    })
  })

  it('should not consume the stream before the "read" event is sent', async() => {
    const stream = new ReadableStream()
    serializeReadableStream(stream)
    expect(stream.locked).toBe(false)
  })
})
