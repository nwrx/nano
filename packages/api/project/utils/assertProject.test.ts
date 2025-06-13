import { AssertionError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { assertProject } from './assertProject'

const VALID_USER = {
  id: '00000000-0000-0000-0000-000000000000',
  username: 'user',
}

describe('assertProject', () => {
  describe('pass', () => {
    it('should assert a project with empty assignments', () => {
      const shouldPass = () => assertProject({
        id: randomUUID(),
        name: 'my-project',
        assignments: [],
      })
      expect(shouldPass).not.toThrow()
    })

    it('should assert a project with assignments', () => {
      const shouldPass = () => assertProject({
        id: randomUUID(),
        name: 'my-project',
        assignments: [
          { user: VALID_USER, permission: 'Read' },
          { user: VALID_USER, permission: 'Write' },
        ],
      })
      expect(shouldPass).not.toThrow()
    })

    it('should assert a project with undefined assignments', () => {
      const shouldPass = () => assertProject({
        id: randomUUID(),
        name: 'my-project',
        assignments: undefined,
      })
      expect(shouldPass).not.toThrow()
    })
  })

  describe('fail', () => {
    it('should throw an error if the project id is not a UUID', () => {
      const shouldThrow = () => assertProject({
        id: 'invalid',
        name: 'my-project',
        assignments: [],
      })
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the project name is empty', () => {
      const shouldThrow = () => assertProject({
        id: randomUUID(),
        name: '',
        assignments: [],
      })
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the user id is not a UUID', () => {
      const shouldThrow = () => assertProject({
        id: randomUUID(),
        name: 'my-project',
        assignments: [{ user: { ...VALID_USER, id: 'invalid' }, permission: 'Read' }],
      })
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the permission is invalid for an assignment', () => {
      const shouldThrow = () => assertProject({
        id: randomUUID(),
        name: 'my-project',
        assignments: [{ user: VALID_USER, permission: 'Invalid' }],
      })
      expect(shouldThrow).toThrow(AssertionError)
    })
  })
})
