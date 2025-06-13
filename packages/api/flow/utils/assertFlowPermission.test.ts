import type { FlowPermission } from './assertFlowPermission'
import { AssertionError } from '@unshared/validation'
import { assertFlowPermission, FLOW_PERMISSIONS } from './assertFlowPermission'

describe('assertFlowPermission', () => {
  it.each(FLOW_PERMISSIONS)('should assert a permission is %s', (permission) => {
    const shouldPass = () => assertFlowPermission(permission)
    expect(shouldPass).not.toThrow()
  })

  it('should throw an error if the permission is not valid', () => {
    const shouldThrow = () => assertFlowPermission('Invalid' as any)
    const values = FLOW_PERMISSIONS.map(value => `'${value}'`).join(', ')
    expect(shouldThrow).toThrow(AssertionError)
    expect(shouldThrow).toThrow(`String is not one of the values: ${values}`)
  })

  it('should infer the permission type', () => {
    type Expected = typeof FLOW_PERMISSIONS[number]
    expectTypeOf<FlowPermission>().toEqualTypeOf<Expected>()
  })
})
