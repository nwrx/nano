import { MessageChannel } from 'node:worker_threads'
import { isSerializedReadableStream } from './isSerializedReadableStream'

describe('isSerializedReadableStream', () => {
  it('should return true for a valid SerializedReadableStream object', () => {
    const { port1 } = new MessageChannel()
    const result = isSerializedReadableStream({ '@instanceOf': 'ReadableStream', 'port': port1 })
    expect(result).toBe(true)
  })

  it('should return false for an invalid SerializedReadableStream object', () => {
    const { port1 } = new MessageChannel()
    const result = isSerializedReadableStream({ port: port1 })
    expect(result).toBe(false)
  })

  it('should return false for a non-object value', () => {
    const result = isSerializedReadableStream(null)
    expect(result).toBe(false)
  })
})
