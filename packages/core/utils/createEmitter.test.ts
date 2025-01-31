import { Emitter } from './createEmitter'

describe('Emitter', () => {
  it('should add and trigger an event listener', () => {
    const emitter = new Emitter<{ 'test': [string] }>()
    const listener = vi.fn()
    emitter.on('test', listener)
    emitter.dispatch('test', 'data')
    expect(listener).toHaveBeenCalledWith('data')
  })

  it('should remove an event listener', () => {
    const emitter = new Emitter<{ 'test': [string] }>()
    const listener = vi.fn()
    const removeListener = emitter.on('test', listener)
    removeListener()
    emitter.dispatch('test', 'data')
    expect(listener).not.toHaveBeenCalled()
  })

  it('should clear all event listeners', () => {
    const emitter = new Emitter<{ 'test': [string] }>()
    const listener = vi.fn()
    emitter.on('test', listener)
    emitter.clearListeners()
    emitter.dispatch('test', 'data')
    expect(listener).not.toHaveBeenCalled()
  })

  it('should dispose of all event listeners', () => {
    const emitter = new Emitter<{ 'test': [string] }>()
    const listener = vi.fn()
    emitter.on('test', listener)
    emitter[Symbol.dispose]()
    emitter.dispatch('test', 'data')
    expect(listener).not.toHaveBeenCalled()
  })

  describe('edge cases', () => {
    it('should pass a reference to a ReadableStream', () => {
      const emitter = new Emitter<{ 'test': [ReadableStream] }>()
      const listener = vi.fn()
      emitter.on('test', listener)
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue('Hello, world!')
          controller.close()
        },
      })
      emitter.dispatch('test', stream)
      expect(listener).toHaveBeenCalledWith(stream)
    })

    it('should pass a ReadableStream that can be read', async() => {
      const emitter = new Emitter<{ 'test': [ReadableStream<string>] }>()
      const stream = new ReadableStream<string>({
        start(controller) {
          controller.enqueue('Hello, world!')
          controller.close()
        },
      })
      const promise = new Promise((resolve) => {
        emitter.on('test', async(stream) => {
          const reader = stream.getReader()
          const chunks = []
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            chunks.push(value)
          }
          resolve(chunks)
        })
      })
      emitter.dispatch('test', stream)
      await expect(promise).resolves.toEqual(['Hello, world!'])
    })
  })
})
