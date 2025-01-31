import { ERRORS as E } from './errors'
import { resolveSchemaUndefinedOrNull } from './resolveSchemaUndefinedOrNull'

describe('resolveSchemaUndefinedOrNull', () => {
  describe('default primitive', () => {
    it('should return the default value if it is a string', () => {
      const result = resolveSchemaUndefinedOrNull('value', { default: 'default value' })
      expect(result).toBe('default value')
    })

    it('should return the default value if it is a number', () => {
      const result = resolveSchemaUndefinedOrNull('value', { default: 42 })
      expect(result).toBe(42)
    })

    it('should return the default value if it is a boolean', () => {
      const result = resolveSchemaUndefinedOrNull('value', { default: true })
      expect(result).toBe(true)
    })
  })

  describe('default object', () => {
    it('should return a deeply cloned default object', () => {
      const defaultValue = { foo: 'bar' }
      const result = resolveSchemaUndefinedOrNull('value', { default: defaultValue })
      expect(result).toEqual(defaultValue)
    })

    it('should return a frozen object if the default value is an array', () => {
      const defaultValue = { foo: 'bar' }
      const result = resolveSchemaUndefinedOrNull('value', { default: defaultValue })
      const isFrozen = Object.isFrozen(result)
      expect(isFrozen).toBe(true)
    })
  })

  describe('x-default function', () => {
    it('should return the result of x-default function if provided', () => {
      const result = resolveSchemaUndefinedOrNull('value', { 'x-default': () => 'default value' })
      expect(result).toBe('default value')
    })
  })

  describe('x-optional', () => {
    it('should return undefined if x-optional is true', () => {
      const result = resolveSchemaUndefinedOrNull('value', { 'x-optional': true })
      expect(result).toBeUndefined()
    })
  })

  describe('required', () => {
    it('should throw an error if the value is required', () => {
      const shouldThrow = () => resolveSchemaUndefinedOrNull('value', {})
      const error = E.INPUT_REQUIRED('value')
      expect(shouldThrow).toThrow(error)
    })
  })
})
