import { ERRORS } from './errors'
import { parseReference } from './parseReference'

describe('parseReference', () => {
  it('should parse a valid reference with 1 values', () => {
    const result = parseReference({ $ref: '#/Nodes/Foo' })
    expect(result).toStrictEqual(['Nodes', 'Foo'])
  })

  it('should parse a valid reference with 2 values', () => {
    const result = parseReference({ $ref: '#/Nodes/Foo/Bar' })
    expect(result).toStrictEqual(['Nodes', 'Foo', 'Bar'])
  })

  it('should parse a valid reference with 3 values', () => {
    const result = parseReference({ $ref: '#/Nodes/Foo/Bar/Baz' })
    expect(result).toStrictEqual(['Nodes', 'Foo', 'Bar', 'Baz'])
  })

  it('should throw an error if the reference format is invalid', () => {
    const shouldThrow = () => parseReference({ $ref: 'InvalidReference' })
    const error = ERRORS.REFERENCE_INVALID_FORMAT()
    expect(shouldThrow).toThrow(error)
  })

  it('should throw an error if the reference tag is invalid', () => {
    const shouldThrow = () => parseReference({ $ref: '/Nodes/Foo/Bar' })
    const error = ERRORS.REFERENCE_INVALID_TAG()
    expect(shouldThrow).toThrow(error)
  })

  it('should throw an error if the reference type is invalid', () => {
    const shouldThrow = () => parseReference({ $ref: '#//Foo/Bar' })
    const error = ERRORS.REFERENCE_INVALID_TYPE()
    expect(shouldThrow).toThrow(error)
  })

  it('should throw an error if the reference value is invalid', () => {
    const shouldThrow = () => parseReference({ $ref: '#/Nodes//Bar' })
    const error = ERRORS.REFERENCE_INVALID_VALUE()
    expect(shouldThrow).toThrow(error)
  })
})
