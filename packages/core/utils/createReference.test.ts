import { createReference } from './createReference'

describe('createReference', () => {
  it('should create a reference with no values', () => {
    const result = createReference('Empty')
    expect(result).toStrictEqual({ $ref: '#Empty' })
  })

  it('should create a reference with a single value', () => {
    const result = createReference('Node', 'NODE_ID')
    expect(result).toStrictEqual({ $ref: '#Node/NODE_ID' })
  })

  it('should create a reference with multiple values', () => {
    const result = createReference('Node', 'NODE_ID', 'CHILD_ID')
    expect(result).toStrictEqual({ $ref: '#Node/NODE_ID/CHILD_ID' })
  })
})
