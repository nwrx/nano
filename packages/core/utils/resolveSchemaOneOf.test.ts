import { resolveSchemaOneOf } from './resolveSchemaOneOf'

describe('resolveSchemaOneOf', () => {
  it('should resolve a value that matches the first schema', async() => {
    const result = await resolveSchemaOneOf('Hello, World!', [{ type: 'string' }, { type: 'number' }])
    expect(result).toBe('Hello, World!')
  })

  it('should resolve a value that matches the second schema', async() => {
    const result = await resolveSchemaOneOf(42, [{ type: 'string' }, { type: 'number' }])
    expect(result).toBe(42)
  })

  it('should throw an error if the value does not match any of the schemas', async() => {
    const shouldReject = resolveSchemaOneOf(true, [{ type: 'string' }, { type: 'number' }])
    await expect(shouldReject).rejects.toThrow('The value does not match any of the oneOf schemas')
  })
})
