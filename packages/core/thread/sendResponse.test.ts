import { addNode } from './addNode'
import { createThread } from './createThread'
import { sendResponse } from './sendResponse'

describe('sendResponse', () => {
  it('should dispatch a "nodeQuestionResponse" event with the correct parameters', () => {
    const thread = createThread()
    const nodeId = addNode(thread, 'example')
    const eventId = 'testEventId'
    const response = 'testResponse'
    const callback = vi.fn()
    thread.on('nodeResponse', callback)
    sendResponse(thread, nodeId, eventId, response)
    expect(callback).toHaveBeenCalledWith(nodeId, { id: eventId, response })
  })

  it('should throw if the node does not exist', () => {
    const thread = createThread()
    const shouldThrow = () => sendResponse(thread, 'invalidNodeId', 'ignored', 'response')
    expect(shouldThrow).toThrow()
  })
})
