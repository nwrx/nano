import type { ProjectPermission } from './assertProjectPermission'
import { ValidationError } from '@unshared/validation'
import { assertProjectPermission, PROJECT_PERMISSIONS } from './assertProjectPermission'

describe('assertProjectPermission', () => {
  it.each(PROJECT_PERMISSIONS)('should assert a permission is %s', (permission) => {
    const shouldPass = () => assertProjectPermission(permission)
    expect(shouldPass).not.toThrow()
  })

  it('should throw an error if the permission is not valid', () => {
    const shouldThrow = () => assertProjectPermission('Invalid' as any)
    const values = PROJECT_PERMISSIONS.map(value => `'${value}'`).join(', ')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow(`String is not one of the values: ${values}`)
  })

  it('should infer the permission type', () => {
    type Expected = typeof PROJECT_PERMISSIONS[number]
    expectTypeOf<ProjectPermission>().toEqualTypeOf<Expected>()
  })
})
