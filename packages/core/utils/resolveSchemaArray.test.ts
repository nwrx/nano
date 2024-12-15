import { ERRORS as E } from './errors'
import { resolveSchemaArray } from './resolveSchemaArray'

describe('resolveSchemaArray', () => {
  it('should resolve a valid array', async() => {
    const result = await resolveSchemaArray([1, 2, 3], { type: 'array', items: { type: 'number' } })
    expect(result).toEqual([1, 2, 3])
  })

  it('should throw an error if the value is not an array', async() => {
    const shouldThrow = resolveSchemaArray('not an array', { type: 'array', items: { type: 'number' } })
    await expect(shouldThrow).rejects.toThrow(E.INPUT_NOT_ARRAY())
  })

  it('should throw an error if the array is too short', async() => {
    const shouldThrow = resolveSchemaArray([1], { type: 'array', items: { type: 'number' }, minItems: 2 })
    await expect(shouldThrow).rejects.toThrow(E.INPUT_ARRAY_TOO_SHORT(2))
  })

  it('should throw an error if the array is too long', async() => {
    const shouldThrow = resolveSchemaArray([1, 2, 3], { type: 'array', items: { type: 'number' }, maxItems: 2 })
    await expect(shouldThrow).rejects.toThrow(E.INPUT_ARRAY_TOO_LONG(2))
  })

  it('should throw an error if the array is not unique', async() => {
    const shouldThrow = resolveSchemaArray([1, 1], { type: 'array', items: { type: 'number' }, uniqueItems: true })
    await expect(shouldThrow).rejects.toThrow(E.INPUT_ARRAY_NOT_UNIQUE())
  })
})
