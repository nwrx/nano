import { ERRORS as E } from '../utils'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { getNode } from './getNode'

describe('getComponentInstance', () => {
  it('should return the component instance for a valid ID', () => {
    const thread = createThread()
    const id = addNode(thread, 'example')
    const result = getNode(thread, id)
    expect(result).toStrictEqual({
      collection: 'core',
      component: undefined,
      input: {},
      metadata: {},
      name: 'example',
      result: {},
      registry: 'default',
      startedAt: 0,
      state: 'idle',
      tag: 'latest',
    })
  })

  it('should throw an error for an invalid id', () => {
    const thread = createThread()
    const shouldThrow = () => getNode(thread, 'invalid-id')
    const error = E.NODE_NOT_FOUND('invalid-id')
    expect(shouldThrow).toThrow(error)
  })
})
