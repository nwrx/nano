import { isSerializedError } from './isSerializedError'

describe('isSerializedError', () => {
  it('should return true for a valid SerializedError object', () => {
    const result = isSerializedError({
      '@instanceOf': 'Error',
      'message': 'Test error',
      'stack': 'Error: Test error\n    at Object.<anonymous> (test.js:1:1)',
      'name': 'Error',
    })
    expect(result).toBe(true)
  })

  it('should return false for an invalid SerializedError object', () => {
    const result = isSerializedError({
      'message': 'Test error',
      'stack': 'Error: Test error\n    at Object.<anonymous> (test.js:1:1)',
      'name': 'Error',
      '@instanceOf': 'NotError',
    })
    expect(result).toBe(false)
  })

  it('should return false for a non-object value', () => {
    const result = isSerializedError(null)
    expect(result).toBe(false)
  })
})
