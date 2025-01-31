import { defineComponent } from '../utils'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { isNodeUsedAsTool } from './isNodeUsedAsTool'

describe('isNodeUsedAsTool', () => {
  const regularComponent = defineComponent({
    isToolSet: false,
    inputs: { value: { type: 'string' } },
    outputs: { value: { type: 'string' } },
  })

  it('should return true if the node has outgoing links WITHOUT sourceName', () => {
    const thread = createThread()
    const sourceId = addNode(thread, 'regular', { component: regularComponent })
    addNode(thread, 'regular', { component: regularComponent, input: { value: { $ref: `#/Nodes/${sourceId}` } } })
    const result = isNodeUsedAsTool(thread, sourceId)
    expect(result).toStrictEqual(true)
  })

  it('should return false if the node has outgoing links WITH sourceName', () => {
    const thread = createThread()
    const sourceId = addNode(thread, 'regular', { component: regularComponent })
    addNode(thread, 'regular', { component: regularComponent, input: { value: { $ref: `#/Nodes/${sourceId}/value` } } })
    const result = isNodeUsedAsTool(thread, sourceId)
    expect(result).toStrictEqual(false)
  })

  it('should return false if the node has NO outgoing links', () => {
    const thread = createThread()
    const nodeId = addNode(thread, 'regular', { component: regularComponent })
    const result = isNodeUsedAsTool(thread, nodeId)
    expect(result).toStrictEqual(false)
  })
})
