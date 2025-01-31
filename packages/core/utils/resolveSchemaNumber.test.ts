import { ERRORS as E } from './errors'
import { resolveSchemaNumber } from './resolveSchemaNumber'

describe('resolveSchemaNumber', () => {
  describe('number', () => {
    it('should resolve a valid number', () => {
      const result = resolveSchemaNumber('value', 42, { type: 'number' })
      expect(result).toBe(42)
    })

    it('should throw an error if the value is not a number', () => {
      const shouldThrow = () => resolveSchemaNumber('value', 'not a number', { type: 'number' })
      const error = E.INPUT_NOT_NUMBER('value')
      expect(shouldThrow).toThrow(error)
    })
  })

  describe('enum', () => {
    it('should resolve a number that is in the enum', () => {
      const result = resolveSchemaNumber('value', 42, { type: 'number', enum: [42, 43] })
      expect(result).toBe(42)
    })

    it('should throw an error if the value is not in the enum', () => {
      const shouldThrow = () => resolveSchemaNumber('value', 44, { type: 'number', enum: [42, 43] })
      const error = E.INPUT_NOT_IN_ENUM('value', [42, 43])
      expect(shouldThrow).toThrow(error)
    })
  })

  describe('minimum', () => {
    it('should resolve a number that is above the minimum', () => {
      const result = resolveSchemaNumber('value', 42, { type: 'number', minimum: 40 })
      expect(result).toBe(42)
    })

    it('should throw an error if the number is below the minimum', () => {
      const shouldThrow = () => resolveSchemaNumber('value', 39, { type: 'number', minimum: 40 })
      const error = E.INPUT_NUMBER_TOO_SMALL('value', 40)
      expect(shouldThrow).toThrow(error)
    })
  })

  describe('minimum exclusive', () => {
    it('should resolve a number that exceeds the minimum', () => {
      const result = resolveSchemaNumber('value', 42, { type: 'number', minimum: 40, exclusiveMinimum: true })
      expect(result).toBe(42)
    })

    it('should throw an error if the number is equal to the minimum', () => {
      const shouldThrow = () => resolveSchemaNumber('value', 40, { type: 'number', minimum: 40, exclusiveMinimum: true })
      const error = E.INPUT_NUMBER_NOT_EXCEED_MINIMUM('value', 40)
      expect(shouldThrow).toThrow(error)
    })
  })

  describe('maximum', () => {
    it('should resolve a number that is below the maximum', () => {
      const result = resolveSchemaNumber('value', 42, { type: 'number', maximum: 50 })
      expect(result).toBe(42)
    })

    it('should throw an error if the number is above the maximum', () => {
      const shouldThrow = () => resolveSchemaNumber('value', 51, { type: 'number', maximum: 50 })
      const error = E.INPUT_NUMBER_TOO_LARGE('value', 50)
      expect(shouldThrow).toThrow(error)
    })
  })

  describe('maximum exclusive', () => {
    it('should resolve a number that is below the maximum', () => {
      const result = resolveSchemaNumber('value', 42, { type: 'number', maximum: 50, exclusiveMaximum: true })
      expect(result).toBe(42)
    })

    it('should throw an error if the number is equal to the maximum', () => {
      const shouldThrow = () => resolveSchemaNumber('value', 50, { type: 'number', maximum: 50, exclusiveMaximum: true })
      const error = E.INPUT_NUNBER_NOT_BELOW_MAXIMUM('value', 50)
      expect(shouldThrow).toThrow(error)
    })
  })

  describe('multipleOf', () => {
    it('should resolve a number that is a multiple of the given value', () => {
      const result = resolveSchemaNumber('value', 10, { type: 'number', multipleOf: 5 })
      expect(result).toBe(10)
    })

    it('should throw an error if the number is not a multiple of the given value', () => {
      const shouldThrow = () => resolveSchemaNumber('value', 7, { type: 'number', multipleOf: 5 })
      const error = E.INPUT_NUMBER_NOT_MULTIPLE_OF('value', 5)
      expect(shouldThrow).toThrow(error)
    })
  })

  describe('integer', () => {
    it('should resolve a valid integer', () => {
      const result = resolveSchemaNumber('value', 42, { type: 'integer' })
      expect(result).toBe(42)
    })

    it('should throw an error if the value is not an integer', () => {
      const shouldThrow = () => resolveSchemaNumber('value', 42.5, { type: 'integer' })
      const error = E.INPUT_NUMBER_NOT_INTEGER('value')
      expect(shouldThrow).toThrow(error)
    })
  })
})
