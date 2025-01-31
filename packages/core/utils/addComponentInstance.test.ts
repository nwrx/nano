import { EXP_UUID } from '@unshared/validation'
import { createThread } from '../createThread'
import { addComponentInstance } from './addComponentInstance'

describe('addComponentInstance', () => {
  it('should add a component instance to the thread and return its ID', () => {
    const thread = createThread()
    const id = addComponentInstance(thread, { kind: 'example' })
    const threadInstance = thread.componentInstances.get(id)
    expect(threadInstance).toStrictEqual({ kind: 'example' })
  })

  it('should generate a unique ID if not provided', () => {
    const thread = createThread()
    const componentInstance = { kind: 'example' }
    const id = addComponentInstance(thread, componentInstance)
    expect(id).toMatch(EXP_UUID)
  })

  it('should use the provided ID if given', () => {
    const thread = createThread()
    const id = addComponentInstance(thread, { kind: 'example', id: 'custom-id' })
    const threadInstance = thread.componentInstances.get(id)
    expect(id).toBe('custom-id')
    expect(threadInstance).toStrictEqual({ kind: 'example' })
  })

  it('should create a copy of the provided component instance', () => {
    const thread = createThread()
    const componentInstance = { kind: 'example' }
    const id = addComponentInstance(thread, componentInstance)
    const threadInstance = thread.componentInstances.get(id)
    expect(threadInstance).not.toBe(componentInstance)
    expect(threadInstance).toStrictEqual(componentInstance)
  })
})
