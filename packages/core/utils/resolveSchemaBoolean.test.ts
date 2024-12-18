import { ERRORS as E } from './errors'
import { resolveSchemaBoolean } from './resolveSchemaBoolean'

describe('resolveSchemaBoolean', () => {
  it('should resolve a valid boolean', () => {
    const result = resolveSchemaBoolean('value', true)
    expect(result).toBe(true)
  })

  it('should throw an error if the value is not a boolean', () => {
    const shouldThrow = () => resolveSchemaBoolean('value', 'not a boolean')
    const error = E.INPUT_NOT_BOOLEAN('value')
    expect(shouldThrow).toThrow(error)
  })
})
