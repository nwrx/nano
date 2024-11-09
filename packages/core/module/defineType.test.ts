import type { Type } from './defineType'
import { assertString, createRule } from '@unshared/validation'
import { defineType } from './defineType'

describe('defineType', () => {
  describe('defineType', () => {
    it('should define a type with the given options', () => {
      const parse = vi.fn()
      const type = defineType({
        kind: 'number',
        parse,
        name: 'Number',
        color: '#FF0000',
        description: 'A numeric value.',
        defaultValue: 0,
      })

      expect(type).toStrictEqual({
        kind: 'number',
        parse,
        name: 'Number',
        color: '#FF0000',
        description: 'A numeric value.',
        defaultValue: 0,
      })
    })

    it('should define a type with minimal options', () => {
      const parse = vi.fn()
      const type = defineType({ kind: 'number', parse })
      expect(type).toStrictEqual({
        kind: 'number',
        parse,
        name: 'number',
        color: undefined,
        description: undefined,
        defaultValue: undefined,
      })
    })

    it('should not return the same object', () => {
      const parse = vi.fn()
      const object = { kind: 'number', parse }
      const type = defineType(object)
      expect(type).not.toBe(object)
    })
  })

  describe('kind', () => {
    it('should throw an error if the kind is undefined', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineType({ kind: undefined, parse: vi.fn() })
      expect(shouldThrow).toThrow('You must provide a kind for the type.')
    })

    it('should throw an error if the kind is not a string', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineType({ kind: 123, parse: vi.fn() })
      expect(shouldThrow).toThrow('The kind of the type must be a string.')
    })

    it('should throw an error if the kind is an empty string', () => {
      const shouldThrow = () => defineType({ kind: '', parse: vi.fn() })
      expect(shouldThrow).toThrow('The kind of the type must be a non-empty string.')
    })

    it('should throw an error if the kind is not kebab-case', () => {
      const shouldThrow = () => defineType({ kind: 'Number', parse: vi.fn() })
      expect(shouldThrow).toThrow('The kind of the type must be kebab-case.')
    })
  })

  describe('parse', () => {
    it('should throw an error if the parse function is undefined', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineType({ kind: 'number', parse: undefined })
      expect(shouldThrow).toThrow('You must provide a parse function for the type.')
    })

    it('should throw an error if the parse function is not a function', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineType({ kind: 'number', parse: 123 })
      expect(shouldThrow).toThrow('The parse function must be a function.')
    })
  })

  describe('name', () => {
    it('should throw an error if the name is not a string', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineType({ kind: 'number', parse: vi.fn(), name: 123 })
      expect(shouldThrow).toThrow('The name of the type must be a string.')
    })

    it('should throw an error if the name is an empty string', () => {
      const shouldThrow = () => defineType({ kind: 'number', parse: vi.fn(), name: '' })
      expect(shouldThrow).toThrow('The name of the type must be a non-empty string.')
    })
  })

  describe('color', () => {
    it('should throw an error if the color is not a string', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineType({ kind: 'number', parse: vi.fn(), color: 123 })
      expect(shouldThrow).toThrow('The color of the type must be a string.')
    })

    it('should throw an error if the color is not a hexadecimal color code', () => {
      const shouldThrow = () => defineType({ kind: 'number', parse: vi.fn(), color: '#FF000' })
      expect(shouldThrow).toThrow('The color of the type must be a hexadecimal color code.')
    })
  })

  describe('description', () => {
    it('should throw an error if the description is not a string', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineType({ kind: 'number', parse: vi.fn(), description: 123 })
      expect(shouldThrow).toThrow('The description of the type must be a string.')
    })

    it('should throw an error if the description is an empty string', () => {
      const shouldThrow = () => defineType({ kind: 'number', parse: vi.fn(), description: '' })
      expect(shouldThrow).toThrow('The description of the type must be a non-empty string.')
    })
  })

  describe('inference', () => {
    it('should return the type of a flow type', () => {
      const type = defineType({ kind: 'number', parse: createRule(assertString) })
      expectTypeOf(type).toEqualTypeOf<Type<string>>()
    })
  })
})
