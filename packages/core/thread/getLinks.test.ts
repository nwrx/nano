import { defineComponent, ERRORS } from '../utils'
import { addLink } from './addLink'
import { addNode } from './addNode'
import { createThread } from './createThread'
import { getLinks } from './getLinks'

describe('getLinks', () => {
  const component = defineComponent({
    outputs: {
      output1: { type: 'string' },
      output2: { type: 'string' },
    },
    inputs: {
      valueSimple: { type: 'string' },
      valueArray: { type: 'array', items: { type: 'string' } },
      valueObject: { type: 'object', properties: { key: { type: 'string' } } },
    },
  })

  describe('with no links', () => {
    it('should return an empty array if there are no links', () => {
      const thread = createThread()
      const result = getLinks(thread)
      expect(result).toStrictEqual([])
    })
  })

  describe('with simple value', () => {
    it('should return links for valid node references', async() => {
      const thread = createThread({ componentResolvers: [() => component] })
      const sourceId = addNode(thread, 'example')
      const targetId = addNode(thread, 'example')
      await addLink(thread, { sourceId, sourceName: 'output1', targetId, targetName: 'valueSimple' })
      const result = getLinks(thread)
      expect(result).toStrictEqual([
        {
          sourceId,
          sourceName: 'output1',
          sourcePath: undefined,
          targetId,
          targetName: 'valueSimple',
        },
      ])
    })
  })

  describe('with array', () => {
    it('should return links for valid node references in arrays', async() => {
      const thread = createThread({ componentResolvers: [() => component] })
      const sourceId = addNode(thread, 'example')
      const targetId = addNode(thread, 'example')
      await addLink(thread, { sourceId, sourceName: 'output1', targetId, targetName: 'valueArray' })
      await addLink(thread, { sourceId, sourceName: 'output2', targetId, targetName: 'valueArray' })
      const result = getLinks(thread)
      expect(result).toStrictEqual([
        {
          sourceId,
          sourceName: 'output1',
          sourcePath: undefined,
          targetId,
          targetName: 'valueArray',
        },
        {
          sourceId,
          sourceName: 'output2',
          sourcePath: undefined,
          targetId,
          targetName: 'valueArray',
        },
      ])
    })
  })

  describe('with object', () => {
    it('should return links for valid node references in objects', async() => {
      const thread = createThread({ componentResolvers: [() => component] })
      const sourceId = addNode(thread, 'example')
      const targetId = addNode(thread, 'example')
      await addLink(thread, { sourceId, sourceName: 'output1', targetId, targetName: 'valueObject', targetPath: 'key1' })
      await addLink(thread, { sourceId, sourceName: 'output2', targetId, targetName: 'valueObject', targetPath: 'key2' })
      const result = getLinks(thread)
      expect(result).toStrictEqual([
        {
          sourceId,
          sourceName: 'output1',
          sourcePath: undefined,
          targetId,
          targetName: 'valueObject',
          targetPath: 'key1',
        },
        {
          sourceId,
          sourceName: 'output2',
          sourcePath: undefined,
          targetId,
          targetName: 'valueObject',
          targetPath: 'key2',
        },
      ])
    })
  })

  describe('with invalid node references', () => {
    it('should throw if one of the source nodes does not exist', () => {
      const thread = createThread({ componentResolvers: [() => component] })
      const id = addNode(thread, 'example', { input: { value: { $ref: '#/Nodes/not-existing/value' } } })
      const shouldThrow = () => getLinks(thread)
      const error = ERRORS.NODE_LINK_SOURCE_NOT_FOUND(id, 'value', 'not-existing')
      expect(shouldThrow).toThrowError(error)
    })
  })
})
