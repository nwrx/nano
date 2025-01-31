import { parseReferenceLink } from './parseReferenceLink'

describe('parseReferenceLink', () => {
  it('should parse a valid Node reference without a source path', () => {
    const result = parseReferenceLink({ $ref: '#/Nodes/Foo/Bar' })
    expect(result).toStrictEqual({
      sourceId: 'Foo',
      sourceName: 'Bar',
      sourcePath: undefined,
    })
  })

  it('should parse a valid Node reference and path with a source path', () => {
    const result = parseReferenceLink({ $ref: '#/Nodes/Foo/Bar/baz' })
    expect(result).toStrictEqual({
      sourceId: 'Foo',
      sourceName: 'Bar',
      sourcePath: 'baz',
    })
  })

  it('should throw an error for an invalid reference type', () => {
    const shouldThrow = () => parseReferenceLink({ $ref: '#/NotNodes/Foo/Bar' })
    expect(shouldThrow).toThrow('Invalid reference type: NotNodes')
  })

  it('should throw an error for a missing source name', () => {
    const shouldThrow = () => parseReferenceLink({ $ref: '#/Nodes/Foo' })
    expect(shouldThrow).toThrow('The reference does not contain a name')
  })

  it('should throw an error for a missing path', () => {
    const shouldThrow = () => parseReferenceLink({ $ref: '#/Nodes' })
    expect(shouldThrow).toThrow('Invalid reference format')
  })
})
