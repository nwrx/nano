import type { ProjectPermission } from './assertProjectPermission'
import { ValidationError } from '@unshared/validation'
import { assertProjectPermission } from './assertProjectPermission'

describe('assertProjectPermission', () => {
  it('should assert a permission is Owner', () => {
    const shouldPass = () => assertProjectPermission('Owner')
    expect(shouldPass).not.toThrow()
  })

  it('should assert a permission is Write', () => {
    const shouldPass = () => assertProjectPermission('Write')
    expect(shouldPass).not.toThrow()
  })

  it('should assert a permission is VaultRead', () => {
    const shouldPass = () => assertProjectPermission('VaultRead')
    expect(shouldPass).not.toThrow()
  })

  it('should assert a permission is VaultWrite', () => {
    const shouldPass = () => assertProjectPermission('VaultWrite')
    expect(shouldPass).not.toThrow()
  })

  it('should assert a permission is Execute', () => {
    const shouldPass = () => assertProjectPermission('Execute')
    expect(shouldPass).not.toThrow()
  })

  it('should assert a permission is Read', () => {
    const shouldPass = () => assertProjectPermission('Read')
    expect(shouldPass).not.toThrow()
  })

  it('should throw an error if the permission is not valid', () => {
    const shouldThrow = () => assertProjectPermission('Invalid' as any)
    expect(shouldThrow).toThrow(ValidationError)
  })

  it('should infer the permission type', () => {
    expectTypeOf<ProjectPermission>().toEqualTypeOf<
      | 'Execute'
      | 'Owner'
      | 'Read'
      | 'VaultRead'
      | 'VaultWrite'
      | 'Write'
    >()
  })
})
