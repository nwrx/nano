import { addNode } from './addNode'
import { cancelQuestion } from './cancelQuestion'
import { createThread } from './createThread'

describe('cancelQuestion', () => {
  it('should dispatch a "nodeQuestionCancel" event with the correct parameters', () => {
    const thread = createThread()
    const nodeId = addNode(thread, 'example')
    const eventId = 'testEventId'
    const callback = vi.fn()
    thread.on('nodeQuestionCancel', callback)
    cancelQuestion(thread, nodeId, eventId)
    expect(callback).toHaveBeenCalledWith(nodeId, eventId)
  })

  it('should throw if the node does not exist', () => {
    const thread = createThread()
    const shouldThrow = () => cancelQuestion(thread, 'invalidNodeId', 'ignored')
    expect(shouldThrow).toThrow()
  })
})
