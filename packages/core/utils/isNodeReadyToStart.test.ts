import { addLink, addNode, createThread } from '../thread'
import { defineComponent } from '../utils'
import { isNodeReadyToStart } from './isNodeReadyToStart'

describe('isNodeReadyToStart', () => {
  const component = defineComponent({
    inputs: {
      input: { type: 'string' },
    },
  })

  it('should return true if node has no incoming links', () => {
    const thread = createThread()
    const targetId = addNode(thread, 'target')
    const result = isNodeReadyToStart(thread, targetId)
    expect(result).toBe(true)
  })

  it('should return true if all incoming links points to a node that is done', async() => {
    const thread = createThread()
    const sourceId = addNode(thread, 'source', { component })
    const targetId = addNode(thread, 'target', { component })
    thread.nodes.get(sourceId)!.state = 'done'
    await addLink(thread, { sourceId, sourceName: 'output', targetId, targetName: 'input' })
    const result = isNodeReadyToStart(thread, targetId)
    expect(result).toBe(true)
  })

  it('should return false if any of the incoming link points to a node that is not done', async() => {
    const thread = createThread()
    const sourceId = addNode(thread, 'source', { component })
    const targetId = addNode(thread, 'target', { component })
    thread.nodes.get(sourceId)!.state = 'processing'
    await addLink(thread, { sourceId, sourceName: 'output', targetId, targetName: 'input' })
    const result = isNodeReadyToStart(thread, targetId)
    expect(result).toBe(false)
  })
})
