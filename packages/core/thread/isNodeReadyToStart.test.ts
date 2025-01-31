import { defineComponent } from '../utils'
import { addLink } from './addLink'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { isNodeReadyToStart } from './isNodeReadyToStart'

describe('isNodeReadyToStart', () => {
  const component = defineComponent({
    inputs: {
      input: { type: 'string' },
    },
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

  it('should return false if any incoming link points to a node that is not done', async() => {
    const thread = createThread()
    const sourceId = addNode(thread, 'source', { component })
    const targetId = addNode(thread, 'target', { component })
    thread.nodes.get(sourceId)!.state = 'processing'
    await addLink(thread, { sourceId, sourceName: 'output', targetId, targetName: 'input' })
    const result = isNodeReadyToStart(thread, targetId)
    expect(result).toBe(false)
  })

  it('should return true if there are no incoming links', () => {
    const thread = createThread()
    const targetId = addNode(thread, 'target')
    const result = isNodeReadyToStart(thread, targetId)
    expect(result).toBe(true)
  })
})
