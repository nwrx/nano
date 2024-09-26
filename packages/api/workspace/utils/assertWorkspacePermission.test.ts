import type { WorkspacePermission } from './assertWorkspacePermission'
import { assertWorkspacePermission } from './assertWorkspacePermission'

test('should assert a permission is Owner', () => {
  const shouldPass = () => assertWorkspacePermission('Owner')
  expect(shouldPass).not.toThrow()
})

test('should assert a permission is Write', () => {
  const shouldPass = () => assertWorkspacePermission('Write')
  expect(shouldPass).not.toThrow()
})

test('should assert a permission is Read', () => {
  const shouldPass = () => assertWorkspacePermission('Read')
  expect(shouldPass).not.toThrow()
})

test('should throw an error if the permission is not valid', () => {
  const shouldThrow = () => assertWorkspacePermission('Invalid' as any)
  expect(shouldThrow).toThrow('Expected value to be one of the following values: \'Owner\', \'Write\', \'Read\' but received: Invalid')
})

test('should infer the permission type', () => {
  expectTypeOf<WorkspacePermission>().toEqualTypeOf<'Owner' | 'Read' | 'Write'>()
})
