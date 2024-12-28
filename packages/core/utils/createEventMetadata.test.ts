import { addNode, createThread } from '../thread'
import { createEventMetadata } from './createEventMetadata'

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
    expect(result.timestamp).toStrictEqual('2020-01-01T00:00:00.000Z')
  })

  it('should create metadata with correct delta if startedAt is set', () => {
    const thread = createThread()
    thread.startedAt = Date.now() - 1000
    const result = createEventMetadata(thread)
    expect(result.delta).toStrictEqual(1000)
  })

  it('should default delta to 0 if startedAt is not set', () => {
    const thread = createThread()
    const result = createEventMetadata(thread)
    expect(result.delta).toStrictEqual(0)
  })

  it('should create metadata with correct state if a nodeId is provided', () => {
    const thread = createThread()
    const nodeId = addNode(thread, 'example')
    const result = createEventMetadata(thread, nodeId)
    expect(result.state).toStrictEqual('idle')
  })

  it('should create metadata with correct duration if a node is provided', () => {
    const thread = createThread()
    const nodeId = addNode(thread, 'example')
    thread.nodes.get(nodeId)!.startedAt = Date.now() - 1000
    const result = createEventMetadata(thread, nodeId)
    expect(result.duration).toStrictEqual(1000)
  })

  it('should not return extra properties', () => {
    const thread = createThread()
    const nodeId = addNode(thread, 'example')
    thread.nodes.get(nodeId)!.startedAt = Date.now() - 1000
    const result = createEventMetadata(thread, nodeId)
    expect(result).toStrictEqual({
      delta: 0,
      duration: 1000,
      state: 'idle',
      timestamp: '2020-01-01T00:00:00.000Z',
    })
  })
})
