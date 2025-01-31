import { joinUrl } from './joinUrl'

describe('joinUrl', () => {
  it('should join a base URL and a path correctly', () => {
    const result = joinUrl('http://example.com', '/path')
    expect(result).toBe('http://example.com/path')
  })

  it('should join a base URL with a trailing slash and a path correctly', () => {
    const result = joinUrl('http://example.com/', '/path')
    expect(result).toBe('http://example.com/path')
  })

  it('should join a base URL and a path without a leading slash correctly', () => {
    const result = joinUrl('http://example.com', 'path')
    expect(result).toBe('http://example.com/path')
  })

  it('should join a base URL with a trailing slash and a path without a leading slash correctly', () => {
    const result = joinUrl('http://example.com/', 'path')
    expect(result).toBe('http://example.com/path')
  })

  it('should handle an empty path correctly', () => {
    const result = joinUrl('http://example.com', '')
    expect(result).toBe('http://example.com/')
  })

  it('should handle an empty base URL correctly', () => {
    const result = joinUrl('', '/path')
    expect(result).toBe('/path')
  })
})
