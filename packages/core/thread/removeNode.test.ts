import { defineComponent } from '../utils'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { removeNode } from './removeNode'

describe('removeNode', () => {
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
    const id1 = addNode(thread, 'example')
    const id2 = addNode(thread, 'example')
    await removeNode(thread, id1)
    expect(thread.nodes.has(id1)).toBe(false)
    expect(thread.nodes.has(id2)).toBe(true)
  })

  it('should remove multiple component instances from the thread', async() => {
    const thread = createThread()
    const id1 = addNode(thread, 'example')
    const id2 = addNode(thread, 'example')
    const id3 = addNode(thread, 'example')
    await removeNode(thread, id1, id2, id3)
    expect(thread.nodes.has(id1)).toBe(false)
    expect(thread.nodes.has(id2)).toBe(false)
    expect(thread.nodes.has(id3)).toBe(false)
  })

  it('should remove the links that have the removed component instances as sources', async() => {
    const thread = createThread()
    const id1 = addNode(thread, 'example', { component })
    const id2 = addNode(thread, 'example', { component, input: { valueSimple: { $ref: `#/Nodes/${id1}/value` } } })
    await removeNode(thread, id1)
    const instance = thread.nodes.get(id2)!
    expect(instance.input.value).toBeUndefined()
  })

  it('should not throw an error if the component instance ID does not exist', () => {
    const thread = createThread()
    const shouldNotThrow = () => removeNode(thread, 'non-existent-id')
    expect(shouldNotThrow).not.toThrow()
  })
})
