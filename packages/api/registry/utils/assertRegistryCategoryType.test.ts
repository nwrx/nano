import type { RegistryCategoryType } from './assertRegistryCategoryType'
import { AssertionError } from '@unshared/validation'
import { assertRegistryCategoryType, REGISTRY_CATEGORY_TYPES } from './assertRegistryCategoryType'

describe('assertRegistryCategoryType', () => {
  it.each(REGISTRY_CATEGORY_TYPES)('should assert a category is %s', (category) => {
    const shouldPass = () => assertRegistryCategoryType(category)
    expect(shouldPass).not.toThrow()
  })

  it('should throw an error if the category is not valid', () => {
    const shouldThrow = () => assertRegistryCategoryType('Invalid' as any)
    const values = REGISTRY_CATEGORY_TYPES.map(value => `'${value}'`).join(', ')
    expect(shouldThrow).toThrow(AssertionError)
    expect(shouldThrow).toThrow(`String is not one of the values: ${values}`)
  })

  it('should infer the category type', () => {
    type Expected = typeof REGISTRY_CATEGORY_TYPES[number]
    expectTypeOf<RegistryCategoryType>().toEqualTypeOf<Expected>()
  })
})
