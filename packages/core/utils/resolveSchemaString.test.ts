import { ERRORS as E } from './errors'
import { resolveSchemaString } from './resolveSchemaString'

describe('resolveSchemaString', () => {
  describe('string', () => {
    it('should resolve a valid string', () => {
      const result = resolveSchemaString('value', 'Hello, World!', { type: 'string' })
      expect(result).toBe('Hello, World!')
    })

    it('should throw an error if the value is not a string', () => {
      const shouldThrow = () => resolveSchemaString('value', 42, { type: 'string' })
      const error = E.INPUT_NOT_STRING('value')
      expect(shouldThrow).toThrow(error)
    })
  })

  describe('enum', () => {
    it('should resolve a string that is in the enum', () => {
      const result = resolveSchemaString('value', 'Hello', { type: 'string', enum: ['Hello', 'World'] })
      expect(result).toBe('Hello')
    })

    it('should throw an error if the value is not in the enum', () => {
      const shouldThrow = () => resolveSchemaString('value', 'Hi, World!', { type: 'string', enum: ['hello', 'world'] })
      const error = E.INPUT_NOT_IN_ENUM('value', ['hello', 'world'])
      expect(shouldThrow).toThrow(error)
    })
  })

  describe('pattern', () => {
    it('should resolve a string that matches the pattern', () => {
      const result = resolveSchemaString('value', 'Hello, World!', { type: 'string', pattern: '^Hello, World!$' })
      expect(result).toBe('Hello, World!')
    })

    it('should throw an error if the string does not match the pattern', () => {
      const shouldThrow = () => resolveSchemaString('value', 'Hi, World!', { type: 'string', pattern: '^Hello, World!$' })
      const error = E.INPUT_PATTERN_MISMATCH('value', '^Hello, World!$')
      expect(shouldThrow).toThrow(error)
    })
  })

  describe('minLength', () => {
    it('should resolve a string that is long enough', () => {
      const result = resolveSchemaString('value', 'Hello, World!', { type: 'string', minLength: 5 })
      expect(result).toBe('Hello, World!')
    })

    it('should throw an error if the string is too short', () => {
      const shouldThrow = () => resolveSchemaString('value', 'Hi', { type: 'string', minLength: 5 })
      const error = E.INPUT_TOO_SHORT('value', 5)
      expect(shouldThrow).toThrow(error)
    })
  })

  describe('maxLength', () => {
    it('should resolve a string that is short enough', () => {
      const result = resolveSchemaString('value', 'Hello, World!', { type: 'string', maxLength: 15 })
      expect(result).toBe('Hello, World!')
    })

    it('should throw an error if the string is too long', () => {
      const shouldThrow = () => resolveSchemaString('value', 'Hello, World!', { type: 'string', maxLength: 5 })
      const error = E.INPUT_TOO_LONG('value', 5)
      expect(shouldThrow).toThrow(error)
    })
  })
})
