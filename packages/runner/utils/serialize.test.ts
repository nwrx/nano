/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TransferListItem } from 'node:worker_threads'
import type { SerializedReadableStream } from './serializeReadableStream.mjs'
import { MessagePort } from 'node:worker_threads'
import { serialize } from './serialize.mjs'

describe('serialize', () => {
  describe('Error', () => {
    it('should serialize a standard Error object', () => {
      const error = new Error('Test error')
      const serialized = serialize(error, [])
      expect(serialized).toEqual({
        '@instanceOf': 'Error',
        'message': 'Test error',
        'stack': expect.any(String),
        'name': 'Error',
      })
    })
  })

  describe('ReadableStream', () => {
    it('should serialize a ReadableStream object', () => {
      const stream = new ReadableStream()
      const transferList: TransferListItem[] = []
      const serialized = serialize(stream, transferList) as SerializedReadableStream
      expect(serialized).toEqual({ '@instanceOf': 'ReadableStream', 'port': expect.any(MessagePort) })
      expect(transferList).toContain(serialized.port)
    })
  })

  describe('Array', () => {
    it('should serialize an array of values', () => {
      const array = [1, 'string', new Error('Test error')]
      const serialized = serialize(array, [])
      expect(serialized).toEqual([
        1,
        'string',
        {
          '@instanceOf': 'Error',
          'message': 'Test error',
          'stack': expect.any(String),
          'name': 'Error',
        },
      ])
    })
  })

  describe('Object', () => {
    it('should serialize an object with various properties', () => {
      const object = {
        number: 1,
        string: 'string',
        error: new Error('Test error'),
      }
      const serialized = serialize(object, [])
      expect(serialized).toEqual({
        number: 1,
        string: 'string',
        error: {
          '@instanceOf': 'Error',
          'message': 'Test error',
          'stack': expect.any(String),
          'name': 'Error',
        },
      })
    })
  })

  describe('function', () => {
    it('should return undefined for functions', () => {
      const serialized = serialize(() => {}, [])
      expect(serialized).toBeUndefined()
    })
  })

  describe('primitive', () => {
    it('should return the string as is', () => {
      const serialized = serialize('string', [])
      expect(serialized).toBe('string')
    })

    it('should return the number as is', () => {
      const serialized = serialize(1, [])
      expect(serialized).toBe(1)
    })

    it('should return the boolean as is', () => {
      const serialized = serialize(true, [])
      expect(serialized).toBe(true)
    })

    it('should return null as is', () => {
      const serialized = serialize(null, [])
      expect(serialized).toBe(null)
    })

    it('should return undefined as is', () => {
      const serialized = serialize(undefined, [])
      expect(serialized).toBe(undefined)
    })

    it('should return BigInt as is', () => {
      const serialized = serialize(1n, [])
      expect(serialized).toBe(1n)
    })
  })
})
