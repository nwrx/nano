import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { assertVault } from './assertVault'
import { VAULT_TYPES } from './assertVaultType'

describe('assertVault', () => {
  describe('pass', () => {
    it('should assert a valid vault with minimal fields', () => {
      const shouldPass = () => assertVault({
        id: randomUUID(),
        name: 'my-vault',
        type: VAULT_TYPES[0],
        configuration: {},
      })
      expect(shouldPass).not.toThrow()
    })

    it('should assert a vault with all fields', () => {
      const shouldPass = () => assertVault({
        id: randomUUID(),
        name: 'my-vault',
        type: VAULT_TYPES[0],
        description: 'My vault description',
        configuration: { key: 'value' },
        assignments: [
          { user: { id: randomUUID(), username: 'jdoe' }, permission: 'Read' },
        ],
      })
      expect(shouldPass).not.toThrow()
    })
  })

  describe('fail', () => {
    it('should throw an error if the vault id is not a UUID', () => {
      const shouldThrow = () => assertVault({
        id: 'invalid',
        name: 'my-vault',
        type: VAULT_TYPES[0],
        configuration: {},
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the vault name is empty', () => {
      const shouldThrow = () => assertVault({
        id: randomUUID(),
        name: '',
        type: VAULT_TYPES[0],
        configuration: {},
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the vault type is invalid', () => {
      const shouldThrow = () => assertVault({
        id: randomUUID(),
        name: 'my-vault',
        type: 'invalid',
        configuration: {},
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if an assignment has invalid user id', () => {
      const shouldThrow = () => assertVault({
        id: randomUUID(),
        name: 'my-vault',
        type: VAULT_TYPES[0],
        configuration: {},
        assignments: [
          { user: { id: 'invalid' }, permission: 'Read' },
        ],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })
  })
})
