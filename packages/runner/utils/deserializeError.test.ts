import type { SerializedError } from './deserializeError'
import { deserializeError } from './deserializeError'

describe('deserializeError', () => {
  it('should deserialize a standard Error object', () => {
    const serialized: SerializedError = {
      '@instanceOf': 'Error',
      'message': 'Test error',
      'stack': 'Error: Test error\n    at Object.<anonymous> (test.js:1:1)',
      'name': 'Error',
    }
    const error = deserializeError(serialized)
    expect(error).toBeInstanceOf(Error)
    expect(error).toMatchObject({
      message: 'Test error',
      stack: 'Error: Test error\n    at Object.<anonymous> (test.js:1:1)',
      name: 'Error',
    })
  })

  it('should deserialize a custom Error object', () => {
    const serialized: SerializedError = {
      '@instanceOf': 'Error',
      'message': 'Custom error message',
      'stack': 'Error: Custom error message\n    at Object.<anonymous> (test.js:1:1)',
      'name': 'CustomError',
    }
    const error = deserializeError(serialized)
    expect(error).toBeInstanceOf(Error)
    expect(error).toMatchObject({
      message: 'Custom error message',
      stack: 'Error: Custom error message\n    at Object.<anonymous> (test.js:1:1)',
      name: 'CustomError',
    })
  })
})
