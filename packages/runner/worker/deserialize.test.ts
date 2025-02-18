/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MessageChannel } from 'node:worker_threads'
import { deserialize } from './deserialize'

describe('deserialize', () => {
  describe('primitive values', () => {
    it('should return null as is', () => {
      const result = deserialize(null)
      expect(result).toBe(null)
    })

    it('should return undefined as is', () => {
      const result = deserialize(undefined)
      expect(result).toBe(undefined)
    })

    it('should return numbers as is', () => {
      const result = deserialize(42)
      expect(result).toBe(42)
    })

    it('should return strings as is', () => {
      const result = deserialize('hello')
      expect(result).toBe('hello')
    })

    it('should return booleans as is', () => {
      const result = deserialize(true)
      expect(result).toBe(true)
    })

    it('should return BigInts as is', () => {
      const result = deserialize(BigInt(42))
      expect(result).toBe(BigInt(42))
    })
  })

  describe('arrays', () => {
    it('should deserialize arrays recursively', () => {
      const input = [1, 'two', { three: 3 }]
      const result = deserialize(input)
      expect(result).toEqual([1, 'two', { three: 3 }])
    })
  })

  describe('objects', () => {
    it('should deserialize plain objects recursively', () => {
      const input = { a: 1, b: { c: 2 }, d: [3, 4] }
      const result = deserialize(input)
      expect(result).toEqual({ a: 1, b: { c: 2 }, d: [3, 4] })
    })

    it('should handle nested serialized errors', () => {
      const input = { error: { '@instanceOf': 'Error', 'message': 'Test error' } }
      const result = deserialize(input)
      expect(result).toMatchObject({ error: expect.any(Error) })
      // @ts-expect-error: result has no inferred type
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.error.message).toBe('Test error')
    })
  })

  describe('ReadableStream', () => {
    it('should deserialize ReadableStream objects', () => {
      const { port1, port2 } = new MessageChannel()
      const input = { '@instanceOf': 'ReadableStream', 'port': port1 }
      const result = deserialize(input)
      expect(result).toBeInstanceOf(ReadableStream)
      port1.close()
      port2.close()
    })
  })

  describe('Error', () => {
    it('should deserialize Error objects', () => {
      const input = { '@instanceOf': 'Error', 'message': 'Test error' }
      const result = deserialize(input)
      expect(result).toBeInstanceOf(Error)
      expect(result).toMatchObject({ message: 'Test error' })
    })
  })

  describe('complex nested structures', () => {
    it('should handle complex nested structures with mixed types', () => {
      const { port1, port2 } = new MessageChannel()
      const input = {
        stream: { '@instanceOf': 'ReadableStream', 'port': port1 },
        error: { '@instanceOf': 'Error', 'message': 'Test error' },
        data: [1, { nested: true }],
      }

      const result = deserialize(input)
      expect(result).toMatchObject({
        stream: expect.any(ReadableStream),
        error: expect.any(Error),
        data: [1, { nested: true }],
      })

      // Cleanup
      port1.close()
      port2.close()
    })
  })
})
