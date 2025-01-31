import { isComponent } from './isComponent'

describe('isComponent', () => {
  it('should return true for a valid Component object', () => {
    const result = isComponent({ kind: 'parse-json' })
    expect(result).toBe(true)
  })

  it('should return false for an object without kind property', () => {
    const result = isComponent({ notKind: 'parse-json' })
    expect(result).toBe(false)
  })

  it('should return false for a non-object value', () => {
    const result = isComponent('string')
    expect(result).toBe(false)
  })

  it('should return false for a null value', () => {
    const result = isComponent(null)
    expect(result).toBe(false)
  })

  it('should return false for an object with a non-string kind property', () => {
    const result = isComponent({ kind: 123 })
    expect(result).toBe(false)
  })
})
