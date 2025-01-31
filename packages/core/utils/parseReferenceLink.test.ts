import { parseReferenceLink } from './parseReferenceLink'

describe('parseReferenceLink', () => {
  it('should parse a valid Node reference', () => {
    const result = parseReferenceLink({ $ref: '#/Nodes/NODE_ID/foo.bar' })
    expect(result).toStrictEqual({ id: 'NODE_ID', path: 'foo.bar' })
  })

  it('should throw an error for an invalid reference kind', () => {
    const shouldThrow = () => parseReferenceLink({ $ref: '#Memory/ID' })
    expect(shouldThrow).toThrow('Invalid reference kind: Memory')
  })

  it('should throw an error for a missing node ID', () => {
    const shouldThrow = () => parseReferenceLink({ $ref: '#Node/' })
    expect(shouldThrow).toThrow('The reference does not contain a node ID')
  })

  it('should throw an error for a missing path', () => {
    const shouldThrow = () => parseReferenceLink({ $ref: '#Node/NODE_ID' })
    expect(shouldThrow).toThrow('The reference does not contain a path')
  })
})
