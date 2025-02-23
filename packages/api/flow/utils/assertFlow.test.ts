import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { assertFlow } from './assertFlow'

const VALID_USER = {
  id: '00000000-0000-0000-0000-000000000000',
  username: 'user',
}

const VALID_FLOW_DATA = {
  version: '1',
  nodes: {},
  metadata: {},
}

describe('assertFlow', () => {
  describe('pass', () => {
    it('should assert a flow with empty assignments', () => {
      const shouldPass = () => assertFlow({
        id: randomUUID(),
        name: 'my-flow',
        data: VALID_FLOW_DATA,
        assignments: [],
      })
      expect(shouldPass).not.toThrow()
    })

    it('should assert a flow with assignments', () => {
      const shouldPass = () => assertFlow({
        id: randomUUID(),
        name: 'my-flow',
        data: VALID_FLOW_DATA,
        assignments: [
          { user: VALID_USER, permission: 'Read' },
          { user: VALID_USER, permission: 'Write' },
        ],
      })
      expect(shouldPass).not.toThrow()
    })

    it('should assert a flow with title and description', () => {
      const shouldPass = () => assertFlow({
        id: randomUUID(),
        name: 'my-flow',
        title: 'My Flow',
        description: 'A test flow',
        data: VALID_FLOW_DATA,
        assignments: undefined,
      })
      expect(shouldPass).not.toThrow()
    })
  })

  describe('fail', () => {
    it('should throw an error if the flow id is not a UUID', () => {
      const shouldThrow = () => assertFlow({
        id: 'invalid',
        name: 'my-flow',
        data: VALID_FLOW_DATA,
        assignments: [],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the flow name is empty', () => {
      const shouldThrow = () => assertFlow({
        id: randomUUID(),
        name: '',
        data: VALID_FLOW_DATA,
        assignments: [],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the flow data is invalid', () => {
      const shouldThrow = () => assertFlow({
        id: randomUUID(),
        name: 'my-flow',
        data: { version: '', nodes: null, metadata: null },
        assignments: [],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the user id is not a UUID', () => {
      const shouldThrow = () => assertFlow({
        id: randomUUID(),
        name: 'my-flow',
        data: VALID_FLOW_DATA,
        assignments: [{ user: { ...VALID_USER, id: 'invalid' }, permission: 'Read' }],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw an error if the permission is invalid for an assignment', () => {
      const shouldThrow = () => assertFlow({
        id: randomUUID(),
        name: 'my-flow',
        data: VALID_FLOW_DATA,
        assignments: [{ user: VALID_USER, permission: 'Invalid' }],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })
  })
})
