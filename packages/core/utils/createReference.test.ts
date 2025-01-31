import { createReference } from './createReference'

describe('createReference', () => {
  it('should create a reference with a single value', () => {
    const result = createReference('Nodes', 'NODE_ID')
    expect(result).toStrictEqual({ $ref: '#/Nodes/NODE_ID' })
  })

  it('should create a reference with multiple values', () => {
    const result = createReference('Nodes', 'NODE_ID', 'CHILD_ID')
    expect(result).toStrictEqual({ $ref: '#/Nodes/NODE_ID/CHILD_ID' })
  })

  it('should throw an error if no values are provided', () => {
    const shouldThrow = () => createReference('Nodes')
    expect(shouldThrow).toThrow('At least one value is required to create a reference')
  })
})
