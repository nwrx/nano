import type { WorkspacePermission } from './assertWorkspacePermission'
import { assertWorkspacePermission } from './assertWorkspacePermission'

describe('assertWorkspacePermission', () => {
  it('should assert a permission is Owner', () => {
    const shouldPass = () => assertWorkspacePermission('Owner')
    expect(shouldPass).not.toThrow()
  })

  it('should assert a permission is Write', () => {
    const shouldPass = () => assertWorkspacePermission('Write')
    expect(shouldPass).not.toThrow()
  })

  it('should assert a permission is Read', () => {
    const shouldPass = () => assertWorkspacePermission('Read')
    expect(shouldPass).not.toThrow()
  })

  it('should throw an error if the permission is not valid', () => {
    const shouldThrow = () => assertWorkspacePermission('Invalid' as any)
    expect(shouldThrow).toThrow('String is not one of the values: \'Owner\', \'Write\', \'Read\'.')
  })

  it('should infer the permission type', () => {
    expectTypeOf<WorkspacePermission>().toEqualTypeOf<'Owner' | 'Read' | 'Write'>()
  })
})
