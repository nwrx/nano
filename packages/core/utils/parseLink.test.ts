import { ERRORS as E } from './errors'
import { parseLink } from './parseLink'

describe('parseLink', () => {
  it('should parse a valid Node reference without a source path', () => {
    const result = parseLink({ $ref: '#/Nodes/Foo/Bar' })
    expect(result).toStrictEqual({
      sourceId: 'Foo',
      sourceName: 'Bar',
      sourcePath: undefined,
    })
  })

  it('should parse a valid Node reference and path with a source path', () => {
    const result = parseLink({ $ref: '#/Nodes/Foo/Bar/baz' })
    expect(result).toStrictEqual({
      sourceId: 'Foo',
      sourceName: 'Bar',
      sourcePath: 'baz',
    })
  })

  it('should throw an error for an invalid reference type', () => {
    const shouldThrow = () => parseLink({ $ref: '#/NotNodes/Foo/Bar' })
    const error = E.REFERENCE_WRONG_TYPE('NotNodes', 'Nodes')
    expect(shouldThrow).toThrow(error)
  })

  it('should throw an error for a missing source id', () => {
    const shouldThrow = () => parseLink({ $ref: '#/Nodes' })
    const error = E.REFERENCE_INVALID_FORMAT()
    expect(shouldThrow).toThrow(error)
  })

  it('should throw an error for a missing source name', () => {
    const shouldThrow = () => parseLink({ $ref: '#/Nodes/Foo' })
    const error = E.REFERENCE_MISSING_NAME('#/Nodes/Foo')
    expect(shouldThrow).toThrow(error)
  })
})
