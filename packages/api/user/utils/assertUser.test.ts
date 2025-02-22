import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { assertUser } from './assertUser'

describe('assertUser', () => {
  describe('pass', () => {
    it('should assert a valid user', () => {
      const shouldPass = () => assertUser({ id: randomUUID(), username: 'john.doe' })
      expect(shouldPass).not.toThrow()
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
