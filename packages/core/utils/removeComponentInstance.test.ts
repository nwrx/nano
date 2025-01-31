import { createThread } from '../createThread'
import { addComponentInstance } from './addComponentInstance'
import { removeComponentInstances } from './removeComponentInstance'

describe('removeComponentInstances', () => {
  it('should remove the specified component instances from the thread', () => {
    const thread = createThread()
    const id1 = addComponentInstance(thread, { kind: 'example-1' })
    const id2 = addComponentInstance(thread, { kind: 'example-2' })
    removeComponentInstances(thread, id1)
    expect(thread.componentInstances.has(id1)).toBe(false)
    expect(thread.componentInstances.has(id2)).toBe(true)
  })

  it('should remove multiple component instances from the thread', () => {
    const thread = createThread()
    const id1 = addComponentInstance(thread, { kind: 'example-1' })
    const id2 = addComponentInstance(thread, { kind: 'example-2' })
    const id3 = addComponentInstance(thread, { kind: 'example-3' })
    removeComponentInstances(thread, id1, id2, id3)
    expect(thread.componentInstances.has(id1)).toBe(false)
    expect(thread.componentInstances.has(id2)).toBe(false)
    expect(thread.componentInstances.has(id3)).toBe(false)
  })

  it('should not throw an error if the component instance ID does not exist', () => {
    const thread = createThread()
    const shouldNotThrow = () => removeComponentInstances(thread, 'non-existent-id')
    expect(shouldNotThrow).not.toThrow()
  })
})
