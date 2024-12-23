/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EXP_UUID } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { addNode, createThread } from '../../../thread'
import { createEventMetadata, ERRORS as E } from '../../../utils'
import { notifyRequestResponse } from './notifyRequestResponse'

describe('notifyRequestResponse', () => {
  beforeAll(() => {
    vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00Z') })
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should dispatch a "notifyRequestResponse" event with the correct parameters', () => {
    const thread = createThread()
    const nodeId = addNode(thread, 'example')
    const callback = vi.fn()
    thread.on('nodeRequestResponse', callback)
    notifyRequestResponse(thread, nodeId, {
      id: randomUUID(),
      status: 200,
      statusText: 'OK',
    })
    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith(
      nodeId,
      {
        id: expect.stringMatching(EXP_UUID),
        status: 200,
        statusText: 'OK',
      },
      createEventMetadata(thread, nodeId),
    )
  })

  it('should throw if the node does not exist', () => {
    const thread = createThread()
    // @ts-expect-error: ignore for testing purposes
    const shouldThrow = () => notifyRequestResponse(thread, 'example', {})
    const error = E.NODE_NOT_FOUND('example')
    expect(shouldThrow).toThrow(error)
  })
})
