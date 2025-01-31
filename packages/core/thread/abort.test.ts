import { abort } from './abort'
import { createThread } from './createThread'

describe('abort', () => {
  it('should abort the thread and dispatch the abort event', () => {
    const thread = createThread()
    const callback = vi.fn()
    thread.on('abort', callback)
    abort(thread)
    expect(callback).toHaveBeenCalled()
  })

  it('should abort the abort controller', () => {
    const thread = createThread()
    const abortController = thread.abortController
    abort(thread)
    expect(abortController.signal.aborted).toBe(true)
  })

  it('should reset the abort controller after aborting', () => {
    const thread = createThread()
    const initialController = thread.abortController
    abort(thread)
    expect(thread.abortController).not.toBe(initialController)
    expect(thread.abortController.signal.aborted).toBe(false)
  })
})
