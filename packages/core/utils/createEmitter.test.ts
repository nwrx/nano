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
})
