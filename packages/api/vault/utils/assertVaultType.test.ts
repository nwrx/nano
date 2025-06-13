import type { VaultType } from './assertVaultType'
import { AssertionError } from '@unshared/validation'
import { assertVaultType, VAULT_TYPES } from './assertVaultType'

describe('assertVaultType', () => {
  it.each(VAULT_TYPES)('should assert a vault type is %s', (type) => {
    const shouldPass = () => assertVaultType(type)
    expect(shouldPass).not.toThrow()
  })

  it('should throw an error if the vault type is not valid', () => {
    const shouldThrow = () => assertVaultType('invalid' as any)
    const values = VAULT_TYPES.map(value => `'${value}'`).join(', ')
    expect(shouldThrow).toThrow(AssertionError)
    expect(shouldThrow).toThrow(`String is not one of the values: ${values}`)
  })

  it('should infer the vault type', () => {
    type Expected = typeof VAULT_TYPES[number]
    expectTypeOf<VaultType>().toEqualTypeOf<Expected>()
  })
})
