import type { VaultPermission } from './assertVaultPermission'
import { AssertionError } from '@unshared/validation'
import { assertVaultPermission, VAULT_PERMISSIONS } from './assertVaultPermission'

describe('assertWorkspacePermission', () => {
  it.each(VAULT_PERMISSIONS)('should assert a permission is %s', (permission) => {
    const shouldPass = () => assertVaultPermission(permission)
    expect(shouldPass).not.toThrow()
  })

  it('should throw an error if the permission is not valid', () => {
    const shouldThrow = () => assertVaultPermission('Invalid' as any)
    const values = VAULT_PERMISSIONS.map(value => `'${value}'`).join(', ')
    expect(shouldThrow).toThrow(AssertionError)
    expect(shouldThrow).toThrow(`String is not one of the values: ${values}`)
  })

  it('should infer the permission type', () => {
    type Expected = typeof VAULT_PERMISSIONS[number]
    expectTypeOf<VaultPermission>().toEqualTypeOf<Expected>()
  })
})
