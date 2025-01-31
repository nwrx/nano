import type { WorkspaceProjectPermission } from './assertProjectPermission'
import { assertProjectPermission } from './assertProjectPermission'

test('should assert a permission is Owner', () => {
  const shouldPass = () => assertProjectPermission('Owner')
  expect(shouldPass).not.toThrow()
})

test('should assert a permission is Write', () => {
  const shouldPass = () => assertProjectPermission('Write')
  expect(shouldPass).not.toThrow()
})

test('should assert a permission is WriteApiKeys', () => {
  const shouldPass = () => assertProjectPermission('WriteApiKeys')
  expect(shouldPass).not.toThrow()
})

test('should assert a permission is WriteSecrets', () => {
  const shouldPass = () => assertProjectPermission('WriteSecrets')
  expect(shouldPass).not.toThrow()
})

test('should assert a permission is WriteVariables', () => {
  const shouldPass = () => assertProjectPermission('WriteVariables')
  expect(shouldPass).not.toThrow()
})

test('should assert a permission is Execute', () => {
  const shouldPass = () => assertProjectPermission('Execute')
  expect(shouldPass).not.toThrow()
})

test('should assert a permission is Read', () => {
  const shouldPass = () => assertProjectPermission('Read')
  expect(shouldPass).not.toThrow()
})

test('should throw an error if the permission is not valid', () => {
  const shouldThrow = () => assertProjectPermission('Invalid' as any)
  expect(shouldThrow).toThrow('Expected value to be one of the following values: \'Owner\', \'Write\', \'WriteApiKeys\', \'WriteSecrets\', \'WriteVariables\', \'Execute\', \'Read\' but received: Invalid')
})

test('should infer the permission type', () => {
  expectTypeOf<WorkspaceProjectPermission>().toEqualTypeOf<'Execute' | 'Owner' | 'Read' | 'Write' | 'WriteApiKeys' | 'WriteSecrets' | 'WriteVariables'>()
})
