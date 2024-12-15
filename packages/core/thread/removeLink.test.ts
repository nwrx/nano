import { defineComponent } from '../utils'
import { add } from './add'
import { createThread } from './createThread'
import { getInstance } from './getInstance'
import { removeLink } from './removeLink'

describe('removeLink', () => {
  const component = defineComponent({
    inputs: {
      valueSimple: { type: 'string' },
      valueArray: { type: 'array', items: { type: 'string' } },
      valueObject: { type: 'object', additionalProperties: { type: 'string' } },
    },
  })

  describe('with simple', () => {
    it('should remove a simple link using the target id, name, and source id and name', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueSimple: { $ref: '#/Nodes/source/output' } } })
      const result = await removeLink(thread, { targetId: id, targetName: 'valueSimple', sourceId: 'source' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueSimple', value: undefined }])
      expect(instance.input).toStrictEqual({ valueSimple: undefined })
    })

    it('should remove a simple link using the target id and name', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueSimple: { $ref: '#/Nodes/source/output' } } })
      const result = await removeLink(thread, { targetId: id, targetName: 'valueSimple' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueSimple', value: undefined }])
      expect(instance.input).toStrictEqual({ valueSimple: undefined })
    })

    it('should remove a simple link using the source id and name', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueSimple: { $ref: '#/Nodes/source/output' } } })
      const result = await removeLink(thread, { sourceId: 'source' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueSimple', value: undefined }])
      expect(instance.input).toStrictEqual({ valueSimple: undefined })
    })

    it('should remove a simple link using the source id', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueSimple: { $ref: '#/Nodes/source/output' } } })
      const result = await removeLink(thread, { sourceId: 'source' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueSimple', value: undefined }])
      expect(instance.input).toStrictEqual({ valueSimple: undefined })
    })

    it('should remove a simple link using the target id', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueSimple: { $ref: '#/Nodes/source/output' } } })
      const result = await removeLink(thread, { targetId: id })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueSimple', value: undefined }])
      expect(instance.input).toStrictEqual({ valueSimple: undefined })
    })
  })

  describe('with array', () => {
    it('should remove a link from an array using the target id, name, and source id and name', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueArray: [{ $ref: '#/Nodes/source/output' }] } })
      const result = await removeLink(thread, { targetId: id, targetName: 'valueArray', sourceId: 'source' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueArray', value: [] }])
      expect(instance.input).toStrictEqual({ valueArray: [] })
    })

    it('should remove a link from an array using the target id and name', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueArray: [{ $ref: '#/Nodes/source/output' }] } })
      const result = await removeLink(thread, { targetId: id, targetName: 'valueArray' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueArray', value: [] }])
      expect(instance.input).toStrictEqual({ valueArray: [] })
    })

    it('should remove a link from an array using the source id and name', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueArray: [{ $ref: '#/Nodes/source/output' }] } })
      const result = await removeLink(thread, { sourceId: 'source' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueArray', value: [] }])
      expect(instance.input).toStrictEqual({ valueArray: [] })
    })

    it('should remove a link from an array using the source id', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueArray: [{ $ref: '#/Nodes/source/output' }] } })
      const result = await removeLink(thread, { sourceId: 'source' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueArray', value: [] }])
      expect(instance.input).toStrictEqual({ valueArray: [] })
    })

    it('should remove a link from an array using the target id', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueArray: [{ $ref: '#/Nodes/source/output' }] } })
      const result = await removeLink(thread, { targetId: id })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueArray', value: [] }])
      expect(instance.input).toStrictEqual({ valueArray: [] })
    })

    it('should keep other links in the array', async() => {
      const thread = createThread()
      const id = add(thread, 'example', {
        component,
        input: {
          valueArray: [
            { $ref: '#/Nodes/source/output' },
            { $ref: '#/Nodes/source2/output2' },
          ],
        },
      })
      const result = await removeLink(thread, { targetId: id, targetName: 'valueArray', sourceId: 'source' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueArray', value: [{ $ref: '#/Nodes/source2/output2' }] }])
      expect(instance.input).toStrictEqual({ valueArray: [{ $ref: '#/Nodes/source2/output2' }] })
    })
  })

  describe('with object', () => {
    it('should remove a link from an object using the target id, name, and source id and name', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueObject: { key: { $ref: '#/Nodes/source/output' } } } })
      const result = await removeLink(thread, { targetId: id, targetName: 'valueObject', sourceId: 'source' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueObject', value: {} }])
      expect(instance.input).toStrictEqual({ valueObject: {} })
    })

    it('should remove a link from an object using the target id and name', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueObject: { key: { $ref: '#/Nodes/source/output' } } } })
      const result = await removeLink(thread, { targetId: id, targetName: 'valueObject' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueObject', value: {} }])
      expect(instance.input).toStrictEqual({ valueObject: {} })
    })

    it('should remove a link from an object using the source id and name', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueObject: { key: { $ref: '#/Nodes/source/output' } } } })
      const result = await removeLink(thread, { sourceId: 'source' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueObject', value: {} }])
      expect(instance.input).toStrictEqual({ valueObject: {} })
    })

    it('should remove a link from an object using the source id', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueObject: { key: { $ref: '#/Nodes/source/output' } } } })
      const result = await removeLink(thread, { sourceId: 'source' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueObject', value: {} }])
      expect(instance.input).toStrictEqual({ valueObject: {} })
    })

    it('should remove a link from an object using the target id', async() => {
      const thread = createThread()
      const id = add(thread, 'example', { component, input: { valueObject: { key: { $ref: '#/Nodes/source/output' } } } })
      const result = await removeLink(thread, { targetId: id })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueObject', value: {} }])
      expect(instance.input).toStrictEqual({ valueObject: {} })
    })

    it('should keep other links in the object', async() => {
      const thread = createThread()
      const id = add(thread, 'example', {
        component,
        input: {
          valueObject: {
            key: { $ref: '#/Nodes/source/output' },
            key2: { $ref: '#/Nodes/source2/output2' },
          },
        },
      })
      const result = await removeLink(thread, { targetId: id, targetName: 'valueObject', sourceId: 'source' })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([{ id, name: 'valueObject', value: { key2: { $ref: '#/Nodes/source2/output2' } } }])
      expect(instance.input).toStrictEqual({ valueObject: { key2: { $ref: '#/Nodes/source2/output2' } } })
    })
  })

  describe('with multiple links', () => {
    it('should remove all links', async() => {
      const thread = createThread()
      const id = add(thread, 'example', {
        component,
        input: {
          valueSimple: { $ref: '#/Nodes/source/output' },
          valueArray: [{ $ref: '#/Nodes/source/output' }],
          valueObject: { key: { $ref: '#/Nodes/source/output' } },
        },
      })
      const result = await removeLink(thread, { targetId: id })
      const instance = getInstance(thread, id)
      expect(result).toStrictEqual([
        { id, name: 'valueSimple', value: undefined },
        { id, name: 'valueArray', value: [] },
        { id, name: 'valueObject', value: {} },
      ])
      expect(instance.input).toStrictEqual({
        valueSimple: undefined,
        valueArray: [],
        valueObject: {},
      })
    })
  })
})
