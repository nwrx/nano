/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EXP_UUID } from '@unshared/validation'
import { addNode, createThread, getNode } from '../thread'
import { createEventMetadata } from './createEventMetadata'
import { ERRORS as E } from './errors'
import { notifyAction } from './notifyAction'

describe('notifyAction', () => {
  beforeAll(() => {
    vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00Z') })
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should dispatch a "nodeAction" event with the correct parameters', () => {
    const thread = createThread()
    const nodeId = addNode(thread, 'example')
    const callback = vi.fn()
    thread.on('nodeAction', callback)
    notifyAction(thread, nodeId, {
      name: 'example',
      description: 'example',
      steps: [{ text: 'example', state: 'pending' }],
    })
    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith(
      nodeId,
      getNode(thread, nodeId),
      {
        id: expect.stringMatching(EXP_UUID),
        name: 'example',
        description: 'example',
        steps: [{ text: 'example', state: 'pending' }],
      },
      createEventMetadata(thread, getNode(thread, nodeId)),
    )
  })

  it('should throw if the node does not exist', () => {
    const thread = createThread()
    const shouldThrow = () => notifyAction(thread, 'example', { name: 'ignored' })
    const error = E.NODE_NOT_FOUND('example')
    expect(shouldThrow).toThrow(error)
  })
})
