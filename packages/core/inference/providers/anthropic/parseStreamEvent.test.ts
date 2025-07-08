import { dedent } from '@unshared/string'
import { parseStreamEvent } from './parseStreamEvent'

function createStreamEvent() {
  const event = dedent(`
    event: message_start
    data: {"type":"message_start","message":{"id":"msg_015TgtY7CnNKY5qr19br17XJ"}}
  `)
  return `${event}\n`
}

describe('parseStreamEvent', () => {
  describe('complete events', () => {
    it('should parse a single event correctly', () => {
      const event = createStreamEvent()
      const result = parseStreamEvent(event)
      expect(result).toStrictEqual({
        events: [{ type: 'message_start', message: { id: 'msg_015TgtY7CnNKY5qr19br17XJ' } }],
        remaining: '',
      })
    })

    it('should parse multiple events correctly', () => {
      const events = [createStreamEvent(), createStreamEvent()].join('\n')
      const result = parseStreamEvent(events)
      expect(result).toStrictEqual({
        events: [
          { type: 'message_start', message: { id: 'msg_015TgtY7CnNKY5qr19br17XJ' } },
          { type: 'message_start', message: { id: 'msg_015TgtY7CnNKY5qr19br17XJ' } },
        ],
        remaining: '',
      })
    })
  })

  describe('incomplete events', () => {
    it('should handle one incomplete events', () => {
      const event = createStreamEvent().slice(0, -5)
      const result = parseStreamEvent(event)
      expect(result).toStrictEqual({ events: [], remaining: event })
    })

    it('should handle one complete event and one incomplete event', () => {
      const event1 = createStreamEvent()
      const event2 = createStreamEvent().slice(0, -5)
      const events = [event1, event2].join('\n')
      const result = parseStreamEvent(events)
      expect(result).toStrictEqual({
        events: [{ type: 'message_start', message: { id: 'msg_015TgtY7CnNKY5qr19br17XJ' } }],
        remaining: event2,
      })
    })
  })

  describe('edge cases', () => {
    it('should handle an empty event correctly', () => {
      const result = parseStreamEvent('')
      expect(result).toStrictEqual({ events: [], remaining: '' })
    })

    it('should push to remaining if the event does not end with a newline', () => {
      const event = createStreamEvent().slice(0, -1)
      const result = parseStreamEvent(event)
      expect(result).toStrictEqual({
        events: [],
        remaining: event,
      })
    })

    it('should parse a event that starts with a newline correctly', () => {
      const event = `\n${createStreamEvent()}`
      const result = parseStreamEvent(event)
      expect(result).toStrictEqual({
        events: [{ type: 'message_start', message: { id: 'msg_015TgtY7CnNKY5qr19br17XJ' } }],
        remaining: '',
      })
    })
  })
})
