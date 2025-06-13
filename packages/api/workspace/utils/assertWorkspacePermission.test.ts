import type { WorkspacePermission } from './assertWorkspacePermission'
import { AssertionError } from '@unshared/validation'
import { assertWorkspacePermission, WORKSPACE_PERMISSIONS } from './assertWorkspacePermission'

describe('assertWorkspacePermission', () => {
  it.each(WORKSPACE_PERMISSIONS)('should assert a permission is %s', (permission) => {
    const shouldPass = () => assertWorkspacePermission(permission)
    expect(shouldPass).not.toThrow()
  })

  it('should throw an error if the permission is not valid', () => {
    const shouldThrow = () => assertWorkspacePermission('Invalid' as any)
    const values = WORKSPACE_PERMISSIONS.map(value => `'${value}'`).join(', ')
    expect(shouldThrow).toThrow(AssertionError)
    expect(shouldThrow).toThrow(`String is not one of the values: ${values}`)
  })

  it('should infer the permission type', () => {
    type Expected = typeof WORKSPACE_PERMISSIONS[number]
    expectTypeOf<WorkspacePermission>().toEqualTypeOf<Expected>()
  })
})
