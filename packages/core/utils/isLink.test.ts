import { isLink } from './isLink'

describe('isLink', () => {
  it('should return true for a valid Node reference', () => {
    const result = isLink({ $ref: '#Node/NODE_ID/foo' })
    expect(result).toBe(true)
  })

  it('should return false for a reference with an invalid kind', () => {
    const result = isLink({ $ref: '#Memory/NODE_ID/foo' })
    expect(result).toBe(false)
  })

  it('should return false for a reference without a node ID', () => {
    const result = isLink({ $ref: '#Node//foo' })
    expect(result).toBe(false)
  })

  it('should return false for a reference without a name', () => {
    const result = isLink({ $ref: '#Node/NODE_ID/' })
    expect(result).toBe(false)
  })

  it('should return false for a non-object value', () => {
    const result = isLink('string')
    expect(result).toBe(false)
  })
})
