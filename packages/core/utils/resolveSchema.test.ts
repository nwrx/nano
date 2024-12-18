import { ERRORS as E } from './errors'
import { resolveSchema } from './resolveSchema'

describe('resolveSchema', () => {
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

  it('should throw an error if the value is undefined and not optional', async() => {
    const shouldThrow = resolveSchema('value', undefined, { type: 'string' })
    const error = E.INPUT_REQUIRED('value')
    await expect(shouldThrow).rejects.toThrow(error)
  })

  it('should return default value if the value is undefined and optional', async() => {
    const result = await resolveSchema('value', undefined, { 'type': 'string', 'x-optional': true, 'default': 'default' })
    expect(result).toBe('default')
  })
})
