import { defineComponent, ERRORS as E } from '../utils'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { getNodeInputSocket } from './getNodeInputSocket'

describe('getNodeInputSocket', () => {
  const component = defineComponent({ inputs: { input: { type: 'string' } } })

  it('should return the input socket if it exists', async() => {
    const thread = createThread()
    const id = addNode(thread, 'example', { component })
    const result = await getNodeInputSocket(thread, id, 'input')
    expect(result).toStrictEqual({ type: 'string' })
  })

  it('should throw an error if the input socket does not exist', async() => {
    const thread = createThread()
    const id = addNode(thread, 'example', { component })
    const shouldReject = getNodeInputSocket(thread, id, 'invalid')
    const error = E.NODE_INPUT_SOCKET_NOT_FOUND(id, 'invalid')
    await expect(shouldReject).rejects.toThrow(error)
  })

  it('should throw an error if the component cannot be resolved', async() => {
    const thread = createThread()
    const id = addNode(thread, 'example')
    const shouldReject = getNodeInputSocket(thread, id, 'input')
    const error = E.COMPONENT_NOT_RESOLVED({
      workspace: 'default',
      collection: 'default',
      registry: 'default',
      name: 'example',
      tag: 'latest',
    })
    await expect(shouldReject).rejects.toThrow(error)
  })
})
