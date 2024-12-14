import { isReference } from './isReference'

describe('isReference', () => {
  it('should return true for a valid Reference object', () => {
    const result = isReference({ $ref: '#Node/NODE_ID/foo' })
    expect(result).toBe(true)
  })

  it('should return false for an object without $ref property', () => {
    const result = isReference({ notRef: '#Node/NODE_ID/foo' })
    expect(result).toBe(false)
  })

  it('should return false for a non-object value', () => {
    const result = isReference('string')
    expect(result).toBe(false)
  })

  it('should return false for a null value', () => {
    const result = isReference(null)
    expect(result).toBe(false)
  })

  it('should return false for an object with a non-string $ref property', () => {
    const result = isReference({ $ref: 123 })
    expect(result).toBe(false)
  })
})
