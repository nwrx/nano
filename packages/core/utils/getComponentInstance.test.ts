import { createThread } from '../createThread'
import { addComponentInstance } from './addComponentInstance'
import { getComponentInstance } from './getComponentInstance'

describe('getComponentInstance', () => {
  it('should return the component instance for a valid ID', () => {
    const thread = createThread()
    const id = addComponentInstance(thread, { specifier: 'example' })
    const result = getComponentInstance(thread, id)
    expect(result).toStrictEqual({ specifier: 'example' })
  })

  it('should throw an error for an invalid ID', () => {
    const thread = createThread()
    const shouldThrow = () => getComponentInstance(thread, 'invalid-id')
    expect(shouldThrow).toThrow('The node with ID "invalid-id" does not exist in the thread.')
  })
})
