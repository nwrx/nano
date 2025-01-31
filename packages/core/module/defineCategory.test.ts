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
        name: 'math',
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

  describe('kind', () => {
    it('should throw an error if the kind is undefined', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineCategory({ kind: undefined })
      expect(shouldThrow).toThrow('You must provide a kind for the category.')
    })

    it('should throw an error if the kind is not a string', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineCategory({ kind: 123 })
      expect(shouldThrow).toThrow('The kind of the category must be a string.')
    })

    it('should throw an error if the kind is an empty string', () => {
      const shouldThrow = () => defineCategory({ kind: '' })
      expect(shouldThrow).toThrow('The kind of the category must be a non-empty string.')
    })

    it('should throw an error if the kind is not kebab-case', () => {
      const shouldThrow = () => defineCategory({ kind: 'Math' })
      expect(shouldThrow).toThrow('The kind of the category must be kebab-case.')
    })
  })

  describe('name', () => {
    it('should throw an error if the name is not a string', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineCategory({ kind: 'math', name: 123 })
      expect(shouldThrow).toThrow('The name of the category must be a string.')
    })

    it('should throw an error if the name is an empty string', () => {
      const shouldThrow = () => defineCategory({ kind: 'math', name: '' })
      expect(shouldThrow).toThrow('The name of the category must be a non-empty string.')
    })
  })

  describe('icon', () => {
    it('should throw an error if the icon is not a string', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineCategory({ kind: 'math', icon: 123 })
      expect(shouldThrow).toThrow('The icon of the category must be a string.')
    })

    it('should throw an error if the icon is an empty string', () => {
      const shouldThrow = () => defineCategory({ kind: 'math', icon: '' })
      expect(shouldThrow).toThrow('The icon of the category must be a non-empty string.')
    })
  })

  describe('color', () => {
    it('should throw an error if the color is not a string', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineCategory({ kind: 'math', color: 123 })
      expect(shouldThrow).toThrow('The color of the category must be a string.')
    })

    it('should throw an error if the color is not a hexadecimal color code', () => {
      const shouldThrow = () => defineCategory({ kind: 'math', color: '#FF000' })
      expect(shouldThrow).toThrow('The color of the category must be a hexadecimal color code.')
    })
  })

  describe('description', () => {
    it('should throw an error if the description is not a string', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineCategory({ kind: 'math', description: 123 })
      expect(shouldThrow).toThrow('The description of the category must be a string.')
    })
  })

  describe('inference', () => {
    it('should return the type of a flow category', () => {
      const category = defineCategory({ kind: 'math' })
      expectTypeOf(category).toEqualTypeOf<Category>()
    })
  })
})
