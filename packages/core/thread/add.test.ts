import { EXP_UUID } from '@unshared/validation'
import { add } from './add'
import { createThread } from './createThread'

describe('add', () => {
  it('should add a component instance to the thread and return its ID', () => {
    const thread = createThread()
    const id = add(thread, 'example')
    const threadInstance = thread.componentInstances.get(id)
    expect(threadInstance).toStrictEqual({ specifier: 'example' })
  })

  it('should generate a unique ID if not provided', () => {
    const thread = createThread()
    const id = add(thread, 'example')
    expect(id).toMatch(EXP_UUID)
  })

  it('should use the provided ID if given', () => {
    const thread = createThread()
    const id = add(thread, 'example', { id: 'custom-id' })
    const threadInstance = thread.componentInstances.get(id)
    expect(id).toBe('custom-id')
    expect(threadInstance).toStrictEqual({ specifier: 'example' })
  })

  it('should throw an error if the ID already exists', () => {
    const thread = createThread()
    add(thread, 'example', { id: 'id' })
    const shouldThrow = () => add(thread, 'example', { id: 'id' })
    expect(shouldThrow).toThrow('A component instance with ID "id" already exists in the thread.')
  })
})
