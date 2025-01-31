import { EXP_UUID } from '@unshared/validation'
import { createThread } from '../createThread'
import { addComponentInstance } from './addComponentInstance'

describe('addComponentInstance', () => {
  it('should add a component instance to the thread and return its ID', () => {
    const thread = createThread()
    const id = addComponentInstance(thread, { specifier: 'example' })
    const threadInstance = thread.componentInstances.get(id)
    expect(threadInstance).toStrictEqual({ specifier: 'example' })
  })

  it('should generate a unique ID if not provided', () => {
    const thread = createThread()
    const componentInstance = { specifier: 'example' }
    const id = addComponentInstance(thread, componentInstance)
    expect(id).toMatch(EXP_UUID)
  })

  it('should use the provided ID if given', () => {
    const thread = createThread()
    const id = addComponentInstance(thread, { specifier: 'example', id: 'custom-id' })
    const threadInstance = thread.componentInstances.get(id)
    expect(id).toBe('custom-id')
    expect(threadInstance).toStrictEqual({ specifier: 'example' })
  })

  it('should create a copy of the provided component instance', () => {
    const thread = createThread()
    const componentInstance = { specifier: 'example' }
    const id = addComponentInstance(thread, componentInstance)
    const threadInstance = thread.componentInstances.get(id)
    expect(threadInstance).not.toBe(componentInstance)
    expect(threadInstance).toStrictEqual(componentInstance)
  })

  it('should throw an error if the ID already exists', () => {
    const thread = createThread()
    addComponentInstance(thread, { specifier: 'example', id: 'id' })
    const shouldThrow = () => addComponentInstance(thread, { specifier: 'example', id: 'id' })
    expect(shouldThrow).toThrow('A component instance with ID "id" already exists in the thread.')
  })
})
