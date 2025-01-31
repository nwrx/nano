import { defineComponent, ERRORS } from '../utils'
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
    await expect(shouldReject).rejects.toThrow(`The input socket "invalid" does not exist on node "${id}"`)
  })

  it('should throw an error if the component cannot be resolved', async() => {
    const thread = createThread()
    const id = addNode(thread, 'example')
    const shouldReject = getNodeInputSocket(thread, id, 'input')
    const error = ERRORS.COMPONENT_NOT_RESOLVED({ collection: 'core', name: 'example', registry: 'default', tag: 'latest' })
    await expect(shouldReject).rejects.toThrow(error)
  })
})
