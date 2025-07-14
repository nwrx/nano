import { joinUrl } from './joinUrl'

describe('joinUrl', () => {
  it('should return an instance of URL', () => {
    const result = joinUrl('http://example.com', '/path')
    expect(result).toBeInstanceOf(URL)
  })

  it('should join a base URL and a path correctly', () => {
    const result = joinUrl('http://example.com', '/path').toString()
    expect(result).toBe('http://example.com/path')
  })

  it('should join a base URL with a trailing slash and a path correctly', () => {
    const result = joinUrl('http://example.com/', '/path').toString()
    expect(result).toBe('http://example.com/path')
  })

  it('should join a base URL and a path without a leading slash correctly', () => {
    const result = joinUrl('http://example.com', 'path').toString()
    expect(result).toBe('http://example.com/path')
  })

  it('should join a base URL with a trailing slash and a path without a leading slash correctly', () => {
    const result = joinUrl('http://example.com/', 'path').toString()
    expect(result).toBe('http://example.com/path')
  })

  it('should handle an empty path correctly', () => {
    const result = joinUrl('http://example.com', '').toString()
    expect(result).toBe('http://example.com/')
  })
})
