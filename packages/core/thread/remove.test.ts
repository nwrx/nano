import { defineComponent } from '../utils'
import { add } from './add'
import { createThread } from './createThread'
import { remove } from './remove'

describe('remove', () => {
  const component = defineComponent({
    inputs: {
      valueSimple: { type: 'string' },
    },
    outputs: {
      value: { type: 'string' },
    },
  })

  it('should remove the specified component instances from the thread', async() => {
    const thread = createThread()
    const id1 = add(thread, 'example')
    const id2 = add(thread, 'example')
    await remove(thread, id1)
    expect(thread.componentInstances.has(id1)).toBe(false)
    expect(thread.componentInstances.has(id2)).toBe(true)
  })

  it('should remove multiple component instances from the thread', async() => {
    const thread = createThread()
    const id1 = add(thread, 'example')
    const id2 = add(thread, 'example')
    const id3 = add(thread, 'example')
    await remove(thread, id1, id2, id3)
    expect(thread.componentInstances.has(id1)).toBe(false)
    expect(thread.componentInstances.has(id2)).toBe(false)
    expect(thread.componentInstances.has(id3)).toBe(false)
  })

  it('should remove the links that have the removed component instances as sources', async() => {
    const thread = createThread()
    const id1 = add(thread, 'example', { component })
    const id2 = add(thread, 'example', { component, input: { valueSimple: { $ref: `#/Nodes/${id1}/value` } } })
    await remove(thread, id1)
    const instance = thread.componentInstances.get(id2)
    expect(instance!.input!.value).toBeUndefined()
  })

  it('should not throw an error if the component instance ID does not exist', () => {
    const thread = createThread()
    const shouldNotThrow = () => remove(thread, 'non-existent-id')
    expect(shouldNotThrow).not.toThrow()
  })
})
