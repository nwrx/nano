import { ValidationError } from '@unshared/validation'
import { assertWorkspace } from './assertWorkspace'

describe('assertWorkspace', () => {
  describe('pass', () => {
    it('should assert a workspace with empty assignments', () => {
      const shouldPass = () => assertWorkspace({
        id: '00000000-0000-0000-0000-000000000000',
        name: 'workspace',
        assignments: [],
      })
      expect(shouldPass).not.toThrow()
    })

    it('should assert a workspace with assignments', () => {
      const shouldPass = () => assertWorkspace({
        id: '00000000-0000-0000-0000-000000000000',
        name: 'workspace',
        assignments: [
          { user: { id: '00000000-0000-0000-0000-000000000000' }, permission: 'Read' },
          { user: { id: '00000000-0000-0000-0000-000000000000' }, permission: 'Write' },
        ],
      })
      expect(shouldPass).not.toThrow()
    })

    it('should assert a workspace with undefined assignments', () => {
      const shouldPass = () => assertWorkspace({
        id: '00000000-0000-0000-0000-000000000000',
        name: 'workspace',
        assignments: undefined,
      })
      expect(shouldPass).not.toThrow()
    })
  })

  describe('fail', () => {
    it('should throw an error if the workspace id is not a UUID', () => {
      const shouldThrow = () => assertWorkspace({
        id: 'invalid',
        name: 'workspace',
        assignments: [],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the workspace name is empty', () => {
      const shouldThrow = () => assertWorkspace({
        id: '00000000-0000-0000-0000-000000000000',
        name: '',
        assignments: [],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the user id is not a UUID', () => {
      const shouldThrow = () => assertWorkspace({
        id: '00000000-0000-0000-0000-000000000000',
        name: 'workspace',
        assignments: [{ user: { id: 'invalid' }, permission: 'Read' }],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the permission is invalid for an assignment', () => {
      const shouldThrow = () => assertWorkspace({
        id: '00000000-0000-0000-0000-000000000000',
        name: 'workspace',
        assignments: [{ user: { id: '00000000-0000-0000-0000-000000000000' }, permission: 'Invalid' }],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })
  })
})
