import { defineComponent, ERRORS } from '../utils'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { getNodeOutputSocket } from './getNodeOutputSocket'

describe('getNodeOutputSocket', () => {
  const component = defineComponent({
    outputs: { output: { type: 'string' } },
  })

  it('should return the output socket if it exists', async() => {
    const thread = createThread()
    const id = addNode(thread, 'example', { component })
    const result = await getNodeOutputSocket(thread, id, 'output')
    expect(result).toStrictEqual({ type: 'string' })
  })

  it('should throw an error if the output socket does not exist', async() => {
    const thread = createThread()
    const id = addNode(thread, 'example', { component })
    const shouldReject = getNodeOutputSocket(thread, id, 'invalid')
    const error = ERRORS.NODE_OUTPUT_SOCKET_NOT_FOUND(id, 'invalid')
    await expect(shouldReject).rejects.toThrow(error)
  })

  it('should throw an error if the component cannot be resolved', async() => {
    const thread = createThread()
    const id = addNode(thread, 'example')
    const shouldReject = getNodeOutputSocket(thread, id, 'output')
    const error = ERRORS.COMPONENT_NOT_RESOLVED({
      collection: 'core',
      name: 'example',
      registry: 'default',
      tag: 'latest',
    })
    await expect(shouldReject).rejects.toThrow(error)
  })
})
