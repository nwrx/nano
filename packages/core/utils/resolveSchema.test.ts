import { typeBoolean, typeNumber, typeObject, typeString } from '../__fixtures__'
import { resolveSchema } from './resolveSchema'

describe('resolveSchema', () => {
  describe('simple types', () => {
    it('should resolve a simple schema with string type', async() => {
      const schema = { name: { type: typeString } }
      const values = { name: 'John Doe' }
      const result = await resolveSchema({ schema, values })
      expect(result).toEqual({ name: 'John Doe' })
    })

    it('should resolve a schema with multiple types', async() => {
      const schema = {
        name: { type: typeString },
        age: { type: typeNumber },
        isActive: { type: typeBoolean },
      }
      const values = { name: 'John Doe', age: 30, isActive: true }
      const result = await resolveSchema({ schema, values })
      expect(result).toEqual({ name: 'John Doe', age: 30, isActive: true })
    })

    it('should resolve a schema with an object type', async() => {
      const schema = { data: { type: typeObject } }
      const values = { data: { key: 'value' } }
      const result = await resolveSchema({ schema, values })
      expect(result).toEqual({ data: { key: 'value' } })
    })

    it('should throw an error for missing required value', async() => {
      const schema = { name: { type: typeString } }
      const values = {}
      const shouldThrow = () => resolveSchema({ schema, values })
      await expect(shouldThrow).rejects.toThrow('Failed to resolve the schema.')
    })

    it('should skip errors when skipErrors is true', async() => {
      const schema = { name: { type: typeString }, age: { type: typeNumber } }
      const values = { name: 'John Doe' }
      const result = await resolveSchema({ schema, values, skipErrors: true })
      expect(result).toEqual({ name: 'John Doe' })
    })
  })

  describe('isIterable', () => {
    it('should resolve a schema with an array of values', async() => {
      const schema = { tags: { type: typeString, isIterable: true } }
      const values = { tags: ['tag1', 'tag2'] }
      const result = await resolveSchema({ schema, values })
      expect(result).toEqual({ tags: ['tag1', 'tag2'] })
    })

    it('should throw an error when passing an object into an isIterable schema', async() => {
      const schema = { tags: { type: typeString, isIterable: true } }
      const values = { tags: { key: 'value' } }
      const shouldThrow = () => resolveSchema({ schema, values })
      await expect(shouldThrow).rejects.toThrow('Failed to resolve the schema.')
    })

    it('should resolve an empty array when value is undefined and isOptional is true', async() => {
      const schema = { tags: { type: typeString, isIterable: true, isOptional: true } }
      const values = {}
      const result = await resolveSchema({ schema, values })
      expect(result).toEqual({ tags: [] })
    })
  })

  describe('isMap', () => {
    it('should resolve a schema with a map of values', async() => {
      const schema = { metadata: { type: typeString, isMap: true } }
      const values = { metadata: { key1: 'value1', key2: 'value2' } }
      const result = await resolveSchema({ schema, values })
      expect(result).toEqual({ metadata: { key1: 'value1', key2: 'value2' } })
    })

    it('should throw an error when passing an array into an isMap schema', async() => {
      const schema = { metadata: { type: typeString, isMap: true } }
      const values = { metadata: ['value1', 'value2'] }
      const shouldThrow = () => resolveSchema({ schema, values })
      await expect(shouldThrow).rejects.toThrow('Failed to resolve the schema.')
    })

    it('should resolve an empty object when value is undefined and isOptional is true', async() => {
      const schema = { metadata: { type: typeString, isMap: true, isOptional: true } }
      const values = {}
      const result = await resolveSchema({ schema, values })
      expect(result).toEqual({ metadata: {} })
    })
  })
})
