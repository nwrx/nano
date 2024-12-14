import { createError, ThreadError } from './createError'

describe('createError', () => {
  it('should create a ThreadError with the given options', () => {
    const options = { name: 'THREAD_ERROR', message: 'An error occurred in the thread.' }
    const result = createError(options)
    expect(result).toBeInstanceOf(ThreadError)
    expect(result.name).toBe('THREAD_ERROR')
    expect(result.message).toBe('An error occurred in the thread.')
    expect(result.context).toStrictEqual({})
  })

  it('should create a ThreadError with context', () => {
    const options = { name: 'THREAD_ERROR', message: 'An error occurred in the thread.', context: { key: 'value' } }
    const result = createError(options)
    expect(result).toBeInstanceOf(ThreadError)
    expect(result.name).toBe('THREAD_ERROR')
    expect(result.message).toBe('An error occurred in the thread.')
    expect(result.context).toStrictEqual({ key: 'value' })
  })
})
