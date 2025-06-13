import { AssertionError } from '@unshared/validation'
import { assertWorkspace } from './assertWorkspace'

const VALID_USER = {
  id: '00000000-0000-0000-0000-000000000000',
  username: 'user',
}

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
          { user: VALID_USER, permission: 'Read' },
          { user: VALID_USER, permission: 'Write' },
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
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the workspace name is empty', () => {
      const shouldThrow = () => assertWorkspace({
        id: '00000000-0000-0000-0000-000000000000',
        name: '',
        assignments: [],
      })
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the user id is not a UUID', () => {
      const shouldThrow = () => assertWorkspace({
        id: '00000000-0000-0000-0000-000000000000',
        name: 'workspace',
        assignments: [{ user: { ...VALID_USER, id: 'invalid' }, permission: 'Read' }],
      })
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the permission is invalid for an assignment', () => {
      const shouldThrow = () => assertWorkspace({
        id: '00000000-0000-0000-0000-000000000000',
        name: 'workspace',
        assignments: [{ user: VALID_USER, permission: 'Invalid' }],
      })
      expect(shouldThrow).toThrow(AssertionError)
    })
  })
})
