import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { assertUser } from './assertUser'

describe('assertUser', () => {
  describe('pass', () => {
    it('should assert and return a valid user with minimal fields', () => {
      const user = { id: randomUUID(), username: 'john.doe', extra: 'field' }
      const result = assertUser(user)
      expect(result).toStrictEqual({ id: user.id, username: user.username })
    })
  })

  describe('fail', () => {
    it('should throw an error if the user id is not a UUID', () => {
      const shouldThrow = () => assertUser({ id: 'invalid', username: 'john.doe' })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the username is empty', () => {
      const shouldThrow = () => assertUser({ id: randomUUID(), username: '' })
      expect(shouldThrow).toThrow(ValidationError)
    })
  })
})
