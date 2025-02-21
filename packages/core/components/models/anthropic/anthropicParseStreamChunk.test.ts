import { dedent } from '@unshared/string'
import { anthropicParseStreamChunk } from './anthropicParseStreamChunk'

function createChunk() {
  const chunk = dedent(`
    event: message_start
    data: {"type":"message_start","message":{"id":"msg_015TgtY7CnNKY5qr19br17XJ"}}
  `)
  return `${chunk}\n`
}

describe('parseResponseStreamChunk', () => {
  describe('complete chunks', () => {
    it('should parse a single chunk correctly', () => {
      const chunk = createChunk()
      const result = anthropicParseStreamChunk(chunk)
      expect(result).toStrictEqual({
        payloads: [{ type: 'message_start', message: { id: 'msg_015TgtY7CnNKY5qr19br17XJ' } }],
        remaining: '',
      })
    })

    it('should parse multiple chunks correctly', () => {
      const chunks = [createChunk(), createChunk()].join('\n')
      const result = anthropicParseStreamChunk(chunks)
      expect(result).toStrictEqual({
        payloads: [
          { type: 'message_start', message: { id: 'msg_015TgtY7CnNKY5qr19br17XJ' } },
          { type: 'message_start', message: { id: 'msg_015TgtY7CnNKY5qr19br17XJ' } },
        ],
        remaining: '',
      })
    })
  })

  describe('incomplete chunks', () => {
    it('should handle one incomplete chunks', () => {
      const chunk = createChunk().slice(0, -5)
      const result = anthropicParseStreamChunk(chunk)
      expect(result).toStrictEqual({ payloads: [], remaining: chunk })
    })

    it('should handle one complete chunk and one incomplete chunk', () => {
      const chunk1 = createChunk()
      const chunk2 = createChunk().slice(0, -5)
      const chunks = [chunk1, chunk2].join('\n')
      const result = anthropicParseStreamChunk(chunks)
      expect(result).toStrictEqual({
        payloads: [{ type: 'message_start', message: { id: 'msg_015TgtY7CnNKY5qr19br17XJ' } }],
        remaining: chunk2,
      })
    })
  })

  describe('edge cases', () => {
    it('should handle an empty chunk correctly', () => {
      const result = anthropicParseStreamChunk('')
      expect(result).toStrictEqual({ payloads: [], remaining: '' })
    })

    it('should push to remaining if the chunk does not end with a newline', () => {
      const chunk = createChunk().slice(0, -1)
      const result = anthropicParseStreamChunk(chunk)
      expect(result).toStrictEqual({
        payloads: [],
        remaining: chunk,
      })
    })

    it('should parse a chunk that starts with a newline correctly', () => {
      const chunk = `\n${createChunk()}`
      const result = anthropicParseStreamChunk(chunk)
      expect(result).toStrictEqual({
        payloads: [{ type: 'message_start', message: { id: 'msg_015TgtY7CnNKY5qr19br17XJ' } }],
        remaining: '',
      })
    })
  })
})
