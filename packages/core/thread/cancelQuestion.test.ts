import { createEventMetadata } from '../utils'
import { addNode } from './addNode'
import { cancelQuestion } from './cancelQuestion'
import { createThread } from './createThread'

describe('cancelQuestion', () => {
  beforeAll(() => {
    vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00Z') })
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should dispatch a "nodeQuestionCancel" event with the correct parameters', () => {
    const thread = createThread()
    const nodeId = addNode(thread, 'example')
    const eventId = 'testEventId'
    const callback = vi.fn()
    thread.on('nodeQuestionCancel', callback)
    cancelQuestion(thread, nodeId, eventId)
    expect(callback).toHaveBeenCalledWith(
      nodeId,
      eventId,
      createEventMetadata(thread, nodeId),
    )
  })

  it('should throw if the node does not exist', () => {
    const thread = createThread()
    const shouldThrow = () => cancelQuestion(thread, 'invalidNodeId', 'ignored')
    expect(shouldThrow).toThrow()
  })
})
