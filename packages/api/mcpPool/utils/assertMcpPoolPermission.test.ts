import type { McpPoolPermission } from './assertMcpPoolPermission'
import { AssertionError } from '@unshared/validation'
import { assertMcpPoolPermission, MCP_POOL_PERMISSIONS } from './assertMcpPoolPermission'

describe('assertMcpPoolPermission', () => {
  it.each(MCP_POOL_PERMISSIONS)('should assert a permission is %s', (permission) => {
    const shouldPass = () => assertMcpPoolPermission(permission)
    expect(shouldPass).not.toThrow()
  })

  it('should throw an error if the permission is not valid', () => {
    const shouldThrow = () => assertMcpPoolPermission('Invalid' as any)
    const values = MCP_POOL_PERMISSIONS.map(value => `'${value}'`).join(', ')
    expect(shouldThrow).toThrow(AssertionError)
    expect(shouldThrow).toThrow(`String is not one of the values: ${values}`)
  })

  it('should infer the permission type', () => {
    type Expected = typeof MCP_POOL_PERMISSIONS[number]
    expectTypeOf<McpPoolPermission>().toEqualTypeOf<Expected>()
  })
})
