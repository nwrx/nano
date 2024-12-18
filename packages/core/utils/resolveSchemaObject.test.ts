import { ERRORS as E } from './errors'
import { resolveSchemaObject } from './resolveSchemaObject'

describe('resolveSchemaObject', () => {
  describe('basic', () => {
    it('should resolve a valid object', async() => {
      const result = await resolveSchemaObject('value', { foo: 'bar' }, {
        type: 'object',
      })
      expect(result).toEqual({ foo: 'bar' })
    })

    it('should throw an error if the value is not an object', async() => {
      const shouldThrow = resolveSchemaObject('value', 'not an object', {
        type: 'object',
        properties: { foo: { type: 'string' } },
      })
      const error = E.INPUT_NOT_OBJECT('value')
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })

  describe('required properties', () => {
    it('should resolve a valid object with required properties', async() => {
      const result = await resolveSchemaObject('value', { foo: 'bar' }, {
        type: 'object',
        properties: { foo: { type: 'string' } },
        required: ['foo'],
      })
      expect(result).toEqual({ foo: 'bar' })
    })

    it('should throw an error if required properties are missing', async() => {
      const shouldThrow = resolveSchemaObject(
        'value',
        { foo: 'bar' },
        { type: 'object', properties: { foo: { type: 'string' } }, required: ['foo', 'bar'] },
      )
      const error = E.INPUT_OBJECT_MISSING_PROPERTIES('value', ['bar'])
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })

  describe('additional properties', () => {
    it('should resolve a valid object without extra properties and additionalProperties is false', async() => {
      const result = await resolveSchemaObject('value', { foo: 'bar' }, {
        type: 'object',
        additionalProperties: false,
        properties: { foo: { type: 'string' } },
      })
      expect(result).toEqual({ foo: 'bar' })
    })

    it('should not parse properties that are already defined', async() => {
      const result = await resolveSchemaObject('value', { foo: 'bar', extra: 123 }, {
        type: 'object',
        additionalProperties: { type: 'number' },
        properties: { foo: { type: 'string' } },
      })
      expect(result).toEqual({ foo: 'bar', extra: 123 })
    })

    it('should accept additional properties if additionalProperties is true', async() => {
      const result = await resolveSchemaObject('value', { foo: 'bar', extra: 'baz' }, {
        type: 'object',
        additionalProperties: true,
        properties: { foo: { type: 'string' } },
      })
      expect(result).toEqual({ foo: 'bar', extra: 'baz' })
    })

    it('should accept additional properties if additionalProperties is a schema', async() => {
      const result = await resolveSchemaObject('value', { foo: 'bar', extra: 'baz' }, {
        type: 'object',
        additionalProperties: { type: 'string' },
        properties: { foo: { type: 'string' } },
      })
      expect(result).toEqual({ foo: 'bar', extra: 'baz' })
    })

    it('should throw an error if there are extra properties and additionalProperties is false', async() => {
      const shouldThrow = resolveSchemaObject('value', { foo: 'bar', extra: 'baz' }, {
        type: 'object',
        additionalProperties: false,
        properties: { foo: { type: 'string' } },
      })
      const error = E.INPUT_OBJECT_EXTRA_PROPERTIES('value', ['extra'])
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should throw if the extra properties do not match the additionalProperties schema', async() => {
      const shouldThrow = resolveSchemaObject('value', { foo: 'bar', extra: 123 }, {
        type: 'object',
        additionalProperties: { type: 'string' },
        properties: { foo: { type: 'string' } },
      })
      const error = E.INPUT_NOT_STRING('value.extra')
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })

  describe('minProperties', () => {
    it('should resolve a valid object with minProperties', async() => {
      const result = await resolveSchemaObject('value', { foo: 'bar' }, {
        type: 'object',
        properties: { foo: { type: 'string' } },
        minProperties: 1,
      })
      expect(result).toEqual({ foo: 'bar' })
    })

    it('should throw an error if the object has too few properties', async() => {
      const shouldThrow = resolveSchemaObject('value', { foo: 'bar' }, {
        type: 'object',
        minProperties: 2,
        additionalProperties: { type: 'string' },
      })
      const error = E.INPUT_OBJECT_TOO_FEW_PROPERTIES('value', 2)
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })

  describe('maxProperties', () => {
    it('should resolve a valid object with maxProperties', async() => {
      const result = await resolveSchemaObject('value', { foo: 'bar' }, {
        type: 'object',
        properties: { foo: { type: 'string' } },
        maxProperties: 1,
      })
      expect(result).toEqual({ foo: 'bar' })
    })

    it('should throw an error if the object has too many properties', async() => {
      const shouldThrow = resolveSchemaObject('value', { foo: 'bar', extra: 'baz' }, {
        type: 'object',
        maxProperties: 1,
        additionalProperties: { type: 'string' },
      })
      const error = E.INPUT_OBJECT_TOO_MANY_PROPERTIES('value', 1)
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })
})
