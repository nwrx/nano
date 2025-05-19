import { ERRORS as E } from './errors'
import { resolveSchemaArray } from './resolveSchemaArray'

describe('resolveSchemaArray', () => {
  describe('happy path', () => {
    it('should resolve a valid array', async() => {
      const result = await resolveSchemaArray('value', [1, 2, 3], { type: 'array', items: { type: 'number' } })
      expect(result).toEqual([1, 2, 3])
    })

    it('should flatten the resolved array', async() => {
      const result = await resolveSchemaArray('value', [[1], [2], [3]], { type: 'array', items: { type: 'number' } })
      expect(result).toEqual([1, 2, 3])
    })

    it('should flatten the resolved array if the schema has "object" items', async() => {
      const result = await resolveSchemaArray(
        'value',
        [{ a: 1 }, { a: 2 }, { a: 3 }],
        { type: 'array', items: { type: 'object' } },
      )
      expect(result).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }])
    })
  })

  describe('preserve nested arrays', () => {
    it('should not flatten the resolved array if the schema has no "items" property', async() => {
      const result = await resolveSchemaArray('value', [[1], [2], [3]], { type: 'array' })
      expect(result).toEqual([[1], [2], [3]])
    })

    it('should not flatten the resolved array if the schema expects nested arrays', async() => {
      const result = await resolveSchemaArray(
        'value',
        [[1], [2], [3]],
        { type: 'array', items: { type: 'array', items: { type: 'number' } } },
      )
      expect(result).toEqual([[1], [2], [3]])
    })

    it('should not flatten the resolved array if the schema has an "anyOf" property', async() => {
      const result = await resolveSchemaArray(
        'value',
        [[1], [2], [3]],
        { type: 'array', items: { anyOf: [{ type: 'array', items: { type: 'number' } }] } },
      )
      expect(result).toEqual([[1], [2], [3]])
    })

    it('should not flatten the resolved array if the schema has a "oneOf" property', async() => {
      const result = await resolveSchemaArray(
        'value',
        [[1], [2], [3]],
        { type: 'array', items: { oneOf: [{ type: 'array', items: { type: 'number' } }] } },
      )
      expect(result).toEqual([[1], [2], [3]])
    })
  })

  describe('edge cases', () => {
    it('should throw an error if the value is not an array', async() => {
      const shouldThrow = resolveSchemaArray('value', 'not an array', { type: 'array', items: { type: 'number' } })
      const error = E.INPUT_NOT_ARRAY('value')
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should throw an error if the array is too short', async() => {
      const shouldThrow = resolveSchemaArray('value', [1], { type: 'array', items: { type: 'number' }, minItems: 2 })
      const error = E.INPUT_ARRAY_TOO_SHORT('value', 2)
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should throw an error if the array is too long', async() => {
      const shouldThrow = resolveSchemaArray('value', [1, 2, 3], { type: 'array', items: { type: 'number' }, maxItems: 2 })
      const error = E.INPUT_ARRAY_TOO_LONG('value', 2)
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should throw an error if the array is not unique', async() => {
      const shouldThrow = resolveSchemaArray('value', [1, 1], { type: 'array', items: { type: 'number' }, uniqueItems: true })
      const error = E.INPUT_ARRAY_NOT_UNIQUE('value', ['1'])
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })
})
