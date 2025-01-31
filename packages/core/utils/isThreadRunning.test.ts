import { addNode, createThread } from '../thread'
import { defineComponent } from '../utils'
import { isThreadRunning } from './isThreadRunning'

describe('isThreadRunning', () => {
  describe('running', () => {
    it('should return true if at least one node is processing', () => {
      const thread = createThread()
      const id1 = addNode(thread, 'example')
      const id2 = addNode(thread, 'example')
      thread.nodes.get(id1)!.state = 'processing'
      thread.nodes.get(id2)!.state = 'done'
      const result = isThreadRunning(thread)
      expect(result).toBe(true)
    })

    it('should return true if at least one node is starting', () => {
      const thread = createThread()
      const id1 = addNode(thread, 'example')
      const id2 = addNode(thread, 'example')
      thread.nodes.get(id1)!.state = 'starting'
      thread.nodes.get(id2)!.state = 'done'
      const result = isThreadRunning(thread)
      expect(result).toBe(true)
    })

    it('should return false if one node is done and the other is error', () => {
      const thread = createThread()
      const id1 = addNode(thread, 'example')
      const id2 = addNode(thread, 'example')
      thread.nodes.get(id1)!.state = 'done'
      thread.nodes.get(id2)!.state = 'error'
      const result = isThreadRunning(thread)
      expect(result).toBe(false)
    })
  })

  describe('not running', () => {
    it('should return false if all nodes are done', () => {
      const thread = createThread()
      const id1 = addNode(thread, 'example')
      const id2 = addNode(thread, 'example')
      thread.nodes.get(id1)!.state = 'done'
      thread.nodes.get(id2)!.state = 'done'
      const result = isThreadRunning(thread)
      expect(result).toBe(false)
    })

    it('should return false no nodes are either starting or processing', () => {
      const thread = createThread()
      const id1 = addNode(thread, 'example')
      const id2 = addNode(thread, 'example')
      const id3 = addNode(thread, 'example')
      thread.nodes.get(id1)!.state = 'done'
      thread.nodes.get(id2)!.state = 'idle'
      thread.nodes.get(id3)!.state = 'error'
      const result = isThreadRunning(thread)
      expect(result).toBe(false)
    })

    it('should return false if all nodes are idle', () => {
      const thread = createThread()
      const id1 = addNode(thread, 'example')
      const id2 = addNode(thread, 'example')
      thread.nodes.get(id1)!.state = 'idle'
      thread.nodes.get(id2)!.state = 'idle'
      const result = isThreadRunning(thread)
      expect(result).toBe(false)
    })

    it('should return false if an idle node is used as a tool', () => {
      const thread = createThread()
      const sourceId = addNode(thread, 'example')
      const targetId = addNode(thread, 'example', {
        component: defineComponent({ inputs: { value: { type: 'string' } } }),
        input: { value: { $ref: `#/Nodes/${sourceId}` } },
      })
      thread.nodes.get(sourceId)!.state = 'idle'
      thread.nodes.get(targetId)!.state = 'done'
      const result = isThreadRunning(thread)
      expect(result).toBe(false)
    })

    it('should return false if there are no nodes', () => {
      const thread = createThread()
      const result = isThreadRunning(thread)
      expect(result).toBe(false)
    })
  })
})
