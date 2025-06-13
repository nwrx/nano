import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { VAULT_TYPES } from './assertVaultType'
import { assertVaultVariable } from './assertVaultVariable'

describe('assertVaultVariable', () => {
  describe('pass', () => {
    it('should assert a valid vault variable with minimal fields', () => {
      const shouldPass = () => assertVaultVariable({ name: 'MY_VARIABLE', data: {} })
      expect(shouldPass).not.toThrow()
    })

    it('should assert a vault variable with all fields', () => {
      const shouldPass = () => assertVaultVariable({
        name: 'MY_VARIABLE',
        data: {},
        vault: { id: randomUUID(), name: 'my-vault', type: VAULT_TYPES[0], configuration: {} },
      })
      expect(shouldPass).not.toThrow()
    })
  })

  describe('fail', () => {
    it('should throw an error if the variable name is empty', () => {
      const shouldThrow = () => assertVaultVariable({ name: '', data: {} })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the variable name is not a string', () => {
      const shouldThrow = () => assertVaultVariable({ name: 123, data: {} })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the data is missing', () => {
      const shouldThrow = () => assertVaultVariable({ name: 'MY_VARIABLE' })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the data is not an object', () => {
      const shouldThrow = () => assertVaultVariable({ name: 'MY_VARIABLE', data: 'invalid-data' })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the vault is invalid', () => {
      const shouldThrow = () => assertVaultVariable({
        name: 'MY_VARIABLE',
        vault: { id: 'invalid-uuid', name: 'my-vault', type: VAULT_TYPES[0], configuration: {} },
      })
      expect(shouldThrow).toThrow(ValidationError)
    })
  })
})
