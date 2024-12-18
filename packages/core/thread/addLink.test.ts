import type { ComponentResolver } from '../utils/resolveComponent'
import { ERRORS as E } from '../utils'
import { defineComponent } from '../utils/defineComponent'
import { addLink } from './addLink'
import { addNode } from './addNode'
import { createThread } from './createThread'

describe('addLink', () => {
  const componentResolvers: ComponentResolver[] = [
    () => defineComponent({
      outputs: {
        output: { type: 'string' },
      },
      inputs: {
        valueSimple: { type: 'string' },
        valueArray: { type: 'array', items: { type: 'string' } },
        valueObject: { type: 'object', properties: { key: { type: 'string' } } },
      },
    }),
  ]

  describe('with simple value', () => {
    it('should return an object with the new value', async() => {
      const thread = createThread({ componentResolvers })
      const sourceId = addNode(thread, 'source')
      const targetId = addNode(thread, 'target')
      const result = await addLink(thread, { sourceId, sourceName: 'output', targetId, targetName: 'valueSimple' })
      expect(result).toStrictEqual({
        id: targetId,
        name: 'valueSimple',
        value: { $ref: `#/Nodes/${sourceId}/output` },
      })
    })

    it('should update the input value of the target instance', async() => {
      const thread = createThread({ componentResolvers })
      const sourceId = addNode(thread, 'source')
      const targetId = addNode(thread, 'target')
      await addLink(thread, { sourceId, sourceName: 'output', targetId, targetName: 'valueSimple' })
      const target = thread.nodes.get(targetId)
      expect(target!.input).toStrictEqual({ valueSimple: { $ref: `#/Nodes/${sourceId}/output` } })
    })
  })

  describe('with array', () => {
    it('should append the value to the target socket if it is an array', async() => {
      const thread = createThread({ componentResolvers })
      const sourceId = addNode(thread, 'source')
      const targetId = addNode(thread, 'target')
      const result = await addLink(thread, { sourceId, sourceName: 'output', targetId, targetName: 'valueArray' })
      expect(result).toStrictEqual({
        id: targetId,
        name: 'valueArray',
        value: [{ $ref: `#/Nodes/${sourceId}/output` }],
      })
    })

    it('should update the input value of the target instance', async() => {
      const thread = createThread({ componentResolvers })
      const sourceId = addNode(thread, 'source')
      const targetId = addNode(thread, 'target')
      await addLink(thread, { sourceId, sourceName: 'output', targetId, targetName: 'valueArray' })
      const target = thread.nodes.get(targetId)
      expect(target!.input).toStrictEqual({ valueArray: [{ $ref: `#/Nodes/${sourceId}/output` }] })
    })
  })

  describe('with object', () => {
    it('should append the value to the target socket if it is an object', async() => {
      const thread = createThread({ componentResolvers })
      const sourceId = addNode(thread, 'source')
      const targetId = addNode(thread, 'target')
      const result = await addLink(thread, { sourceId, sourceName: 'output', targetId, targetName: 'valueObject', targetPath: 'key' })
      expect(result).toStrictEqual({
        id: targetId,
        name: 'valueObject',
        value: { key: { $ref: `#/Nodes/${sourceId}/output` } },
      })
    })

    it('should update the input value of the target instance', async() => {
      const thread = createThread({ componentResolvers })
      const sourceId = addNode(thread, 'source')
      const targetId = addNode(thread, 'target')
      await addLink(thread, { sourceId, sourceName: 'output', targetId, targetName: 'valueObject', targetPath: 'key' })
      const target = thread.nodes.get(targetId)
      expect(target!.input).toStrictEqual({ valueObject: { key: { $ref: `#/Nodes/${sourceId}/output` } } })
    })
  })

  describe('edge cases', () => {
    it('should reject if the source node does not exist', async() => {
      const thread = createThread({ componentResolvers })
      const shouldReject = addLink(thread, { sourceId: 'source', sourceName: 'output', targetId: 'target', targetName: 'valueSimple' })
      const error = E.NODE_NOT_FOUND('target')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should reject if the target node does not exist', async() => {
      const thread = createThread({ componentResolvers })
      addNode(thread, 'source', { id: 'source' })
      const shouldReject = addLink(thread, { sourceId: 'source', sourceName: 'output', targetId: 'target', targetName: 'valueSimple' })
      const error = E.NODE_NOT_FOUND('target')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should reject if the target socket does not exist', async() => {
      const thread = createThread({ componentResolvers })
      const sourceId = addNode(thread, 'source')
      const targetId = addNode(thread, 'target')
      const shouldReject = addLink(thread, { sourceId, sourceName: 'output', targetId, targetName: 'invalid' })
      await expect(shouldReject).rejects.toThrow(`The input socket "invalid" does not exist on node "${targetId}"`)
    })

    it('should reject if trying to link a node to itself', async() => {
      const thread = createThread({ componentResolvers })
      const id = addNode(thread, 'source')
      const shouldReject = addLink(thread, { sourceId: id, sourceName: 'output', targetId: id, targetName: 'input' })
      await expect(shouldReject).rejects.toThrow('Cannot link a node to itself')
    })
  })
})
