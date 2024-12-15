import { isLink } from './isLink'

describe('isLink', () => {
  it('should return true for a valid link reference', () => {
    const result = isLink({ $ref: '#/Nodes/Foo/Bar' })
    expect(result).toBe(true)
  })

  it('should return false for an non-link reference', () => {
    const result = isLink({ $ref: '#/NotNodes/Foo/Bar' })
    expect(result).toBe(false)
  })

  it('should return false for a reference with an invalid format', () => {
    const result = isLink({ $ref: 'InvalidFormat' })
    expect(result).toBe(false)
  })

  it('should return false for a non-reference value', () => {
    const result = isLink({ notARef: 'example' })
    expect(result).toBe(false)
  })
})
