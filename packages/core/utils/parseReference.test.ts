import { parseReference } from './parseReference'

describe('parseReference', () => {
  it('should parse a valid reference', () => {
    const result = parseReference({ $ref: '#/Nodes/Foo/Bar' })
    expect(result).toStrictEqual(['Nodes', 'Foo', 'Bar'])
  })

  it('should throw an error if the reference format is invalid', () => {
    expect(() => parseReference({ $ref: 'invalid' })).toThrow('Invalid reference format')
  })

  it('should throw an error if the reference tag is invalid', () => {
    expect(() => parseReference({ $ref: '/Nodes/Foo/Bar' })).toThrow('Invalid reference tag')
  })

  it('should throw an error if the reference type is invalid', () => {
    expect(() => parseReference({ $ref: '#//Foo/Bar' })).toThrow('Invalid reference type')
  })

  it('should throw an error if the reference value is invalid', () => {
    expect(() => parseReference({ $ref: '#/Nodes//Bar' })).toThrow('Invalid reference value')
  })
})
