import { ERRORS as E } from './errors'
import { resolveSchemaStream } from './resolveSchemaStream'

describe('resolveSchemaStream', () => {
  it('should resolve a valid ReadableStream', () => {
    const stream = new ReadableStream()
    const result = resolveSchemaStream('value', stream)
    expect(result).toBe(stream)
  })

  it('should throw an error if the value is not a ReadableStream', () => {
    const shouldThrow = () => resolveSchemaStream('value', 'not a stream')
    const error = E.INPUT_NOT_STREAM('value')
    expect(shouldThrow).toThrow(error)
  })

  it('should throw an error if the stream is locked', () => {
    const stream = new ReadableStream()
    stream.getReader() // Lock the stream
    const shouldThrow = () => resolveSchemaStream('value', stream)
    const error = E.INPUT_STREAM_LOCKED('value')
    expect(shouldThrow).toThrow(error)
  })
})
