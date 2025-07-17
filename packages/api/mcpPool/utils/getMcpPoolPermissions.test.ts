import type { Context } from '../../__fixtures__'
import { AssertionError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { getMcpPoolPermissions } from './getMcpPoolPermissions'

describe('getMcpPoolPermissions', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('success cases', (it) => {
    it('should return assignments for an MCP pool with multiple users', async(context) => {
      const { user: user1, workspace } = await context.setupUser()
      const { user: user2 } = await context.setupUser()
      const { pool } = await context.setupMcpPool({
        user: user1,
        workspace,
        assignments: [
          [user1, 'Owner'],
          [user2, 'Read'],
          [user2, 'Write'],
        ],
      })
      const result = await getMcpPoolPermissions.call(context.moduleMcp, { pool })
      expect(result).toStrictEqual({
        [user1.username]: ['Owner'],
        [user2.username]: ['Read', 'Write'],
      })
    })

    it('should return empty object for MCP pool with no user assignments', async(context) => {
      const { user, workspace } = await context.setupUser()
      const { pool } = await context.setupMcpPool({ user, workspace })
      const result = await getMcpPoolPermissions.call(context.moduleMcp, { pool })
      expect(result).toEqual({})
    })

    it('should handle MCP pool with single user having multiple permissions', async(context) => {
      const { user, workspace } = await context.setupUser()
      const { pool } = await context.setupMcpPool({
        user,
        workspace,
        assignments: [
          [user, 'Read'],
          [user, 'Write'],
        ],
      })
      const result = await getMcpPoolPermissions.call(context.moduleMcp, { pool })
      expect(result).toStrictEqual({
        [user.username]: ['Read', 'Write'],
      })
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw AssertionError on missing options', async(context) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getMcpPoolPermissions.call(context.moduleMcp, {})
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw AssertionError on invalid pool', async(context) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getMcpPoolPermissions.call(context.moduleMcp, { pool: 'invalid' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })
  })
})
