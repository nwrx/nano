import { ERRORS as E } from './errors'
import { resolveSchema } from './resolveSchema'

describe('resolveSchema', () => {
  describe('references', () => {
    it('should resolve a reference when resolvers are provided', async() => {
      const resolver = () => 'Hello, World!'
      const result = await resolveSchema('value', { $ref: '#/Variables/Greet' }, { type: 'string' }, [resolver])
      expect(result).toBe('Hello, World!')
    })

    it('should throw an error if the reference is not resolved', async() => {
      const shouldThrow = resolveSchema('value', { $ref: '#/Variables/Greet' }, { type: 'string' })
      const error = E.REFERENCE_NOT_RESOLVED('value')
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should throw an error if the reference value is undefined', async() => {
      const resolver = () => undefined
      const shouldThrow = resolveSchema('value', { $ref: '#/Variables/Greet' }, { type: 'string' }, [resolver])
      const error = E.REFERENCE_NOT_RESOLVED('value')
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should throw an error if the reference value does not match the schema', async() => {
      const resolver = () => 42
      const shouldThrow = resolveSchema('value', { $ref: '#/Variables/Greet' }, { type: 'string' }, [resolver])
      const error = E.INPUT_NOT_STRING('value')
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should resolve object with nested references', async() => {
      const resolver = () => 'Hello, World!'
      const result = await resolveSchema(
        'value',
        { foo: { $ref: '#/Variables/Greet' } },
        { type: 'object', properties: { foo: { type: 'string' } } },
        [resolver],
      )
      expect(result).toEqual({ foo: 'Hello, World!' })
    })
  })

  describe('untyped', () => {
    it('should accept string values', async() => {
      const result = await resolveSchema('value', 'Hello, World!', {})
      expect(result).toBe('Hello, World!')
    })

    it('should accept number values', async() => {
      const result = await resolveSchema('value', 42, {})
      expect(result).toBe(42)
    })

    it('should accept boolean values', async() => {
      const result = await resolveSchema('value', true, {})
      expect(result).toBe(true)
    })

    it('should accept array values', async() => {
      const result = await resolveSchema('value', [1, 2, 3], {})
      expect(result).toEqual([1, 2, 3])
    })

    it('should accept object values', async() => {
      const result = await resolveSchema('value', { foo: 'bar' }, {})
      expect(result).toEqual({ foo: 'bar' })
    })
  })

  describe('oneOf', () => {
    it('should resolve a value that is in the oneOf', async() => {
      const result = await resolveSchema('value', 42, { oneOf: [{ type: 'number' }, { type: 'string' }] })
      expect(result).toBe(42)
    })

    it('should reject with an error if the value is not in the oneOf', async() => {
      const shouldReject = resolveSchema('value', true, { oneOf: [{ type: 'number' }, { type: 'string' }] })
      const error = E.INPUT_NOT_ONE_OF('value', [
        E.INPUT_NOT_NUMBER('value'),
        E.INPUT_NOT_STRING('value'),
      ])
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe('enum', () => {
    it('should resolve a string that is in the enum', async() => {
      const result = await resolveSchema('value', 'Hello', { type: 'string', enum: ['Hello', 'World'] })
      expect(result).toBe('Hello')
    })

    it('should resolve a number that is in the enum', async() => {
      const result = await resolveSchema('value', 42, { type: 'number', enum: [42, 43] })
      expect(result).toBe(42)
    })

    it('should reject with an error if the value is not in the enum', async() => {
      const shouldReject = resolveSchema('value', 'Hi, World!', { type: 'string', enum: ['hello', 'world'] })
      const error = E.INPUT_NOT_IN_ENUM('value', ['hello', 'world'])
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe('const', () => {
    it('should resolve a string that is the same as the const', async() => {
      const result = await resolveSchema('value', 'Hello', { type: 'string', const: 'Hello' })
      expect(result).toBe('Hello')
    })

    it('should resolve a number that is the same as the const', async() => {
      const result = await resolveSchema('value', 42, { type: 'number', const: 42 })
      expect(result).toBe(42)
    })

    it('should reject with an error if the value is not the same as the const', async() => {
      const shouldReject = resolveSchema('value', 'Hi, World!', { type: 'string', const: 'Hello' })
      const error = E.INPUT_NOT_CONST('value', 'Hello')
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe('primitive', () => {
    it('should resolve a valid string', async() => {
      const result = await resolveSchema('value', 'Hello, World!', { type: 'string' })
      expect(result).toBe('Hello, World!')
    })

    it('should resolve a valid number', async() => {
      const result = await resolveSchema('value', 42, { type: 'number' })
      expect(result).toBe(42)
    })

    it('should resolve a valid boolean', async() => {
      const result = await resolveSchema('value', true, { type: 'boolean' })
      expect(result).toBe(true)
    })

    it('should resolve a valid array', async() => {
      const result = await resolveSchema('value', [1, 2, 3], { type: 'array', items: { type: 'number' } })
      expect(result).toEqual([1, 2, 3])
    })

    it('should resolve a valid object', async() => {
      const result = await resolveSchema('value', { foo: 'bar' }, { type: 'object', properties: { foo: { type: 'string' } } })
      expect(result).toEqual({ foo: 'bar' })
    })
  })

  describe('x-optional', () => {
    it('should return undefined if the value is undefined and optional', async() => {
      const result = await resolveSchema('value', undefined, { 'type': 'string', 'x-optional': true })
      expect(result).toBeUndefined()
    })

    it('should return undefined if the value is null and optional', async() => {
      const result = await resolveSchema('value', null, { 'type': 'string', 'x-optional': true })
      expect(result).toBeUndefined()
    })

    it('should return the default value if the value is undefined and optional', async() => {
      const result = await resolveSchema('value', undefined, { 'type': 'string', 'x-optional': true, 'default': 'Hello, World!' })
      expect(result).toBe('Hello, World!')
    })

    it('should return the default value if the value is null and optional', async() => {
      const result = await resolveSchema('value', null, { 'type': 'string', 'x-optional': true, 'default': 'Hello, World!' })
      expect(result).toBe('Hello, World!')
    })
  })

  describe('x-default', () => {
    it('should return the default value if the value is undefined', async() => {
      const result = await resolveSchema('value', undefined, { 'type': 'string', 'x-default': () => 'Hello, World!' })
      expect(result).toStrictEqual('Hello, World!')
    })

    it('should return the default value if the value is null', async() => {
      const result = await resolveSchema('value', null, { 'type': 'object', 'x-default': () => ({ foo: 'bar' }) })
      expect(result).toStrictEqual({ foo: 'bar' })
    })
  })

  describe('default', () => {
    it('should return the default value if the value is undefined', async() => {
      const result = await resolveSchema('value', undefined, { type: 'string', default: 'Hello, World!' })
      expect(result).toStrictEqual('Hello, World!')
    })

    it('should return the default value if the value is null', async() => {
      const result = await resolveSchema('value', null, { type: 'string', default: 'Hello, World!' })
      expect(result).toStrictEqual('Hello, World!')
    })

    it('should return a deep clone of the default value', async() => {
      const defaultValue = { foo: 'bar' }
      const result = await resolveSchema('value', undefined, { type: 'object', default: defaultValue })
      expect(result).toStrictEqual(defaultValue)
      expect(result).not.toBe(defaultValue)
    })
  })

  describe('required', () => {
    it('should throw an error if the value is required', async() => {
      const shouldThrow = resolveSchema('value', undefined, { type: 'string' })
      const error = E.INPUT_REQUIRED('value')
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should throw if reference is null and value is required', async() => {
      const resolver = () => null
      const shouldThrow = resolveSchema('value', { $ref: '#/Variables/Greet' }, { type: 'string' }, [resolver])
      const error = E.INPUT_REQUIRED('value')
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })
})
