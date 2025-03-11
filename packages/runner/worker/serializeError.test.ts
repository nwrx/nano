/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { serializeError } from './serializeError.mjs'

describe('serializeError', () => {
  it('should serialize a standard Error object', () => {
    const error = new Error('Test error')
    const serialized = serializeError(error)
    expect(serialized).toEqual({
      '@instanceOf': 'Error',
      'message': 'Test error',
      'stack': expect.any(String),
      'name': 'Error',
    })
  })

  it('should serialize a custom Error object', () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message)
        this.name = 'CustomError'
      }
    }
    const error = new CustomError('Custom error message')
    const serialized = serializeError(error)
    expect(serialized).toEqual({
      '@instanceOf': 'Error',
      'message': 'Custom error message',
      'stack': expect.any(String),
      'name': 'CustomError',
    })
  })

  it('should serialize an Error object with a context', () => {
    const error = new Error('Test error')
    // @ts-expect-error: Add context to the error object.
    error.context = { key: 'value' }
    const serialized = serializeError(error)
    expect(serialized).toEqual({
      '@instanceOf': 'Error',
      'message': 'Test error',
      'stack': expect.any(String),
      'name': 'Error',
      'context': { key: 'value' },
    })
  })

  it('should serialize nested errors in context', () => {
    const error = new Error('Test error')
    // @ts-expect-error: Add context to the error object.
    error.context = { key: 'value', error: new Error('Nested error') }
    const serialized = serializeError(error)
    expect(serialized).toEqual({
      '@instanceOf': 'Error',
      'message': 'Test error',
      'stack': expect.any(String),
      'name': 'Error',
      'context': {
        key: 'value',
        error: {
          '@instanceOf': 'Error',
          'message': 'Nested error',
          'stack': expect.any(String),
          'name': 'Error',
        },
      },
    })
  })

  it('should serialize a string error', () => {
    const error = 'String error'
    const serialized = serializeError(error)
    expect(serialized).toEqual({
      '@instanceOf': 'Error',
      'message': 'String error',
      'stack': '',
      'name': 'Error',
    })
  })

  it('should serialize an unknown error', () => {
    const error = undefined
    const serialized = serializeError(error)
    expect(serialized).toEqual({
      '@instanceOf': 'Error',
      'message': 'undefined',
      'stack': '',
      'name': 'Error',
    })
  })
})
