import { add } from './add'
import { createThread } from './createThread'
import { getInstance } from './getInstance'

describe('getComponentInstance', () => {
  it('should return the component instance for a valid ID', () => {
    const thread = createThread()
    const id = add(thread, 'example')
    const result = getInstance(thread, id)
    expect(result).toStrictEqual({ specifier: 'example' })
  })

  it('should throw an error for an invalid id', () => {
    const thread = createThread()
    const shouldThrow = () => getInstance(thread, 'invalid-id')
    expect(shouldThrow).toThrow('The node with ID "invalid-id" does not exist in the thread.')
  })
})
