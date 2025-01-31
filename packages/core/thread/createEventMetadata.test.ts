import type { Node } from './addNode'
import { createEventMetadata } from './createEventMetadata'
import { createThread } from './createThread'

describe('createEventMetadata', () => {
  beforeAll(() => {
    vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00.000Z') })
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should create metadata with correct timestamp', () => {
    const thread = createThread()
    const result = createEventMetadata(thread)
    expect(result.timestamp).toBe('2020-01-01T00:00:00.000Z')
  })

  it('should create metadata with correct delta if startedAt is set', () => {
    const thread = createThread()
    thread.startedAt = Date.now() - 1000
    const result = createEventMetadata(thread)
    expect(result.delta).toBe(1000)
  })

  it('should default delta to 0 if startedAt is not set', () => {
    const thread = createThread()
    const result = createEventMetadata(thread)
    expect(result.delta).toBe(0)
  })

  it('should create metadata with correct state if a node is provided', () => {
    const thread = createThread()
    const result = createEventMetadata(thread, { state: 'done' } as Node)
    expect(result.state).toBe('done')
  })

  it('should create metadata with correct duration if a node is provided', () => {
    const thread = createThread()
    const result = createEventMetadata(thread, { startedAt: Date.now() - 1000 } as Node)
    expect(result.duration).toBe(1000)
  })

  it('should not return extra properties', () => {
    const thread = createThread()
    const result = createEventMetadata(thread, { state: 'done', startedAt: Date.now() - 1000 } as Node)
    expect(result).toStrictEqual({
      delta: 0,
      duration: 1000,
      state: 'done',
      timestamp: '2020-01-01T00:00:00.000Z',
    })
  })
})
