import { ERRORS as E } from '../utils'
import { createThreadFromFlow } from './createThreadFromFlow'

describe('createThreadFromFlow', () => {
  describe('v1', () => {
    it('should correctly add a node to the thread', () => {
      const thread = createThreadFromFlow({
        version: '1',
        nodes: {
          node1: { component: 'passthrough', _meta: 'metadata', message: 'Hello' },
          node2: { component: 'passthrough', _meta: 'metadata', message: 'World' },
        },
      })
      expect([...thread.nodes]).toStrictEqual([
        ['node1', {
          collection: 'default',
          component: undefined,
          input: { message: 'Hello' },
          metadata: { meta: 'metadata' },
          name: 'passthrough',
          registry: 'default',
          workspace: 'default',
          result: {},
          startedAt: 0,
          state: 'idle',
          tag: 'latest',
        }],
        ['node2', {
          collection: 'default',
          component: undefined,
          input: { message: 'World' },
          metadata: { meta: 'metadata' },
          name: 'passthrough',
          registry: 'default',
          workspace: 'default',
          result: {},
          startedAt: 0,
          state: 'idle',
          tag: 'latest',
        }],
      ])
    })
  })

  describe('errors', () => {
    it('should throw an error if the version is missing', () => {
      // @ts-expect-error: Testing invalid input.
      const shouldThrow = () => createThreadFromFlow({ nodes: {} })
      const error = E.FLOW_VERSION_MISSING()
      expect(shouldThrow).toThrow(error)
    })

    it('should throw an error if the version is unsupported', () => {
      // @ts-expect-error: Testing invalid input.
      const shouldThrow = () => createThreadFromFlow({ version: '2', nodes: {} })
      const error = E.FLOW_VERSION_UNSUPPORTED('2')
      expect(shouldThrow).toThrow(error)
    })

    it('should throw an error if a node is not an object', () => {
      // @ts-expect-error: Testing invalid input.
      const shouldThrow = () => createThreadFromFlow({ version: '1', nodes: { node1: 'invalid' } })
      const error = E.FLOW_NODE_NOT_OBJECT('node1')
      expect(shouldThrow).toThrow(error)
    })

    it('should throw an error if a node specifier is not a string', () => {
      // @ts-expect-error: Testing invalid input.
      const shouldThrow = () => createThreadFromFlow({ version: '1', nodes: { node1: { component: 1 } } })
      const error = E.FLOW_NODE_SPECIFIER_NOT_STRING('node1')
      expect(shouldThrow).toThrow(error)
    })
  })

})
