import { AssertionError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { assertUser } from './assertUser'

describe('assertUser', () => {
  describe('pass', () => {
    it('should assert and return a valid user with minimal fields', () => {
      const user = { id: randomUUID(), username: 'john.doe', extra: 'field' }
      const result = assertUser(user)
      expect(result).toStrictEqual({
        id: user.id,
        username: user.username,
        isSuperAdministrator: undefined,
      })
    })

    it('should assert and return a valid user with all fields', () => {
      const user = { id: randomUUID(), username: 'john.doe', isSuperAdministrator: true }
      const result = assertUser(user)
      expect(result).toStrictEqual({
        id: user.id,
        username: user.username,
        isSuperAdministrator: user.isSuperAdministrator,
      })
    })

    it('should allow isSuperAdministrator to be null', () => {
      const user = { id: randomUUID(), username: 'john.doe', isSuperAdministrator: null }
      const result = assertUser(user)
      expect(result).toStrictEqual({
        id: user.id,
        username: user.username,
        isSuperAdministrator: null,
      })
    })
  })

  describe('fail', () => {
    it('should throw an error if the user id is not a UUID', () => {
      const shouldThrow = () => assertUser({ id: 'invalid', username: 'john.doe' })
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the username is empty', () => {
      const shouldThrow = () => assertUser({ id: randomUUID(), username: '' })
      expect(shouldThrow).toThrow(AssertionError)
    })
  })
})
