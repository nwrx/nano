import { createError, ThreadError } from './createError'

describe('createError', () => {
  it('should create a ThreadError instance', () => {
    const options = { name: 'THREAD_ERROR', message: 'An error occurred in the thread.' }
    const result = createError(options)
    expect(result).toBeInstanceOf(ThreadError)
  })

  it('should set the correct name', () => {
    const options = { name: 'THREAD_ERROR', message: 'An error occurred in the thread.' }
    const result = createError(options)
    expect(result.name).toBe('THREAD_ERROR')
  })

  it('should set the correct message', () => {
    const options = { name: 'THREAD_ERROR', message: 'An error occurred in the thread.' }
    const result = createError(options)
    expect(result.message).toBe('An error occurred in the thread.')
  })

  it('should set the default context', () => {
    const options = { name: 'THREAD_ERROR', message: 'An error occurred in the thread.' }
    const result = createError(options)
    expect(result.context).toStrictEqual({})
  })

  it('should create a ThreadError with context and set the correct context', () => {
    const options = { name: 'THREAD_ERROR', message: 'An error occurred in the thread.', context: { key: 'value' } }
    const result = createError(options)
    expect(result.context).toStrictEqual({ key: 'value' })
  })
})
