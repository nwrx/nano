import { createReference } from './createReference'

describe('createReference', () => {
  it('should create a reference with no values', () => {
    const result = createReference('Empty')
    expect(result).toStrictEqual({ $ref: '#/Empty' })
  })

  it('should create a reference with a single value', () => {
    const result = createReference('Nodes', 'NODE_ID')
    expect(result).toStrictEqual({ $ref: '#/Nodes/NODE_ID' })
  })

  it('should create a reference with multiple values', () => {
    const result = createReference('Nodes', 'NODE_ID', 'CHILD_ID')
    expect(result).toStrictEqual({ $ref: '#/Nodes/NODE_ID/CHILD_ID' })
  })
})
