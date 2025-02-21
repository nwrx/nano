import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { assertProject } from './assertProject'

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
          { user: { id: randomUUID() }, permission: 'Read' },
          { user: { id: randomUUID() }, permission: 'Write' },
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
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the project name is empty', () => {
      const shouldThrow = () => assertProject({
        id: randomUUID(),
        name: '',
        assignments: [],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the user id is not a UUID', () => {
      const shouldThrow = () => assertProject({
        id: randomUUID(),
        name: 'my-project',
        assignments: [{ user: { id: 'invalid' }, permission: 'Read' }],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the permission is invalid for an assignment', () => {
      const shouldThrow = () => assertProject({
        id: randomUUID(),
        name: 'my-project',
        assignments: [{ user: { id: randomUUID() }, permission: 'Invalid' }],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })
  })
})
