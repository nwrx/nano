import type { Category } from './defineCategory'
import { defineCategory } from './defineCategory'

describe('defineCategory', () => {
  describe('defineCategory', () => {
    it('should define a flow category with the given options', () => {
      const category = defineCategory({
        kind: 'math',
        name: 'Math',
        icon: 'https://api.iconify.design/carbon:math.svg',
        color: '#FF0000',
        description: 'A collection of nodes for performing mathematical operations.',
      })

      expect(category).toStrictEqual({
        kind: 'math',
        name: 'Math',
        icon: 'https://api.iconify.design/carbon:math.svg',
        color: '#FF0000',
        description: 'A collection of nodes for performing mathematical operations.',
      })
    })

    it('should define a flow category with minimal options', () => {
      const category = defineCategory({ kind: 'math' })
      expect(category).toStrictEqual({
        kind: 'math',
        name: undefined,
        icon: undefined,
        color: undefined,
        description: undefined,
      })
    })

    it('should not return the same object', () => {
      const object = { kind: 'math' }
      const category = defineCategory(object)
      expect(category).not.toBe(object)
    })
  })

  describe('error cases', () => {
    it('should throw an error if options is undefined', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineCategory()
      expect(shouldThrow).toThrow('Expected value not to be null or undefined')
    })

    it('should throw an error if the kind is undefined', () => {
    // @ts-expect-error: test invalid input
      const shouldThrow = () => defineCategory({ kind: undefined })
      expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
    })

    it('should throw an error if the kind is null', () => {
    // @ts-expect-error: test invalid input
    // eslint-disable-next-line unicorn/no-null
      const shouldThrow = () => defineCategory({ kind: null })
      expect(shouldThrow).toThrow('Expected value to be a string but received: null')
    })

    it('should throw an error if the kind is an empty string', () => {
      const shouldThrow = () => defineCategory({ kind: '' })
      expect(shouldThrow).toThrow('Expected value to be a non-empty string but received an empty string')
    })

    it('should throw an error if the kind is not a string', () => {
    // @ts-expect-error: test invalid input
      const shouldThrow = () => defineCategory({ kind: 123 })
      expect(shouldThrow).toThrow('Expected value to be a string but received: number')
    })
  })

  describe('type inference', () => {
    it('should return the type of a flow category', () => {
      const category = defineCategory({ kind: 'math' })
      expectTypeOf(category).toEqualTypeOf<Category>()
    })
  })
})
