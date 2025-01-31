import { parseLink } from './parseLink'

describe('parseReferenceLink', () => {
  it('should parse a valid Node reference with a path', () => {
    const result = parseLink({ $ref: '#Node/NODE_ID/foo/bar' })
    expect(result).toStrictEqual({ sourceId: 'NODE_ID', sourceName: 'foo', sourcePath: 'bar' })
  })

  it('should parse a valid Node reference without a path', () => {
    const result = parseLink({ $ref: '#Node/NODE_ID/foo' })
    expect(result).toStrictEqual({ sourceId: 'NODE_ID', sourceName: 'foo', sourcePath: undefined })
  })

  it('should throw an error for an invalid reference kind', () => {
    const shouldThrow = () => parseLink({ $ref: '#Memory/ID' })
    expect(shouldThrow).toThrow('Invalid reference kind: Memory')
  })

  it('should throw an error for a missing node ID', () => {
    const shouldThrow = () => parseLink({ $ref: '#Node/' })
    expect(shouldThrow).toThrow('The reference does not contain a node ID')
  })

  it('should throw an error for a missing path', () => {
    const shouldThrow = () => parseLink({ $ref: '#Node/NODE_ID' })
    expect(shouldThrow).toThrow('The reference does not contain a name')
  })
})
