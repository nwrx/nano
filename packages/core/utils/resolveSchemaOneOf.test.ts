import { ERRORS } from './errors'
import { resolveSchemaOneOf } from './resolveSchemaOneOf'

describe('resolveSchemaOneOf', () => {
  it('should resolve a value that matches the first schema', async() => {
    const result = await resolveSchemaOneOf('value', 'Hello, World!', [{ type: 'string' }, { type: 'number' }])
    expect(result).toBe('Hello, World!')
  })

  it('should resolve a value that matches the second schema', async() => {
    const result = await resolveSchemaOneOf('value', 42, [{ type: 'string' }, { type: 'number' }])
    expect(result).toBe(42)
  })

  it('should throw an error if the value does not match any of the schemas', async() => {
    const shouldReject = resolveSchemaOneOf('value', true, [{ type: 'string' }, { type: 'number' }])
    const error = ERRORS.INPUT_NOT_ONE_OF('value', [ERRORS.INPUT_NOT_STRING('value'), ERRORS.INPUT_NOT_NUMBER('value')])
    await expect(shouldReject).rejects.toThrow(error)
  })
})
