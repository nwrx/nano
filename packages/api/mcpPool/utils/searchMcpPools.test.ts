/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import type { McpPoolPermission } from './assertMcpPoolPermission'
import { AssertionError, EXP_UUID } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { MCP_POOL_PERMISSIONS } from './assertMcpPoolPermission'
import { searchMcpPools } from './searchMcpPools'

interface TestMatrixOptions {
  withPermission?: McpPoolPermission
}

async function createResult(context: Context, options: TestMatrixOptions) {
  const { withPermission } = options
  const { user, workspace } = await context.setupUser()
  await context.setupMcpPool({ name: 'pool', user, workspace, assignments: [[user, withPermission]] })
  return await searchMcpPools.call(context.moduleMcp, { user, workspace })
}

describe('searchMcpPools', () => {
  beforeEach<Context>(createTestContext)

  // Iterate over all possible permissions
  for (const withPermission of [...MCP_POOL_PERMISSIONS, undefined]) {
    describe<Context>(withPermission ? `with user with ${withPermission} permission` : 'with user without any permission', (it) => {

      if (withPermission === 'Read' || withPermission === 'Owner') {
        it('should return the MCP pools', async(context) => {
          const result = await createResult(context, { withPermission })
          expect(result).toMatchObject([{ id: expect.stringMatching(EXP_UUID), name: 'pool' }])
        })
      }
      else {
        it('should return an empty array', async(context) => {
          const result = await createResult(context, { withPermission })
          expect(result).toEqual([])
        })
      }
    })
  }

  describe<Context>('filtering', (it) => {
    it('should return empty array when no matches found', async(context) => {
      const { user, workspace } = await context.setupUser()
      const results = await searchMcpPools.call(context.moduleMcp, { user, workspace, search: 'pool' })
      expect(results).toEqual([])
    })

    it('should find using case-insensitive search', async(context) => {
      const { user, workspace } = await context.setupUser()
      await context.setupMcpPool({ user, workspace, name: 'pool' })
      const results = await searchMcpPools.call(context.moduleMcp, { user, workspace, search: 'POOL' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('pool')
    })

    it('should return all MCP pools when search is not provided', async(context) => {
      const { user, workspace } = await context.setupUser()
      await context.setupMcpPool({ user, workspace, name: 'pool1' })
      await context.setupMcpPool({ user, workspace, name: 'pool2' })
      const results = await searchMcpPools.call(context.moduleMcp, { user, workspace })
      expect(results).toHaveLength(2)
    })

    it('should respect pagination and ordering options', async(context) => {
      const { user, workspace } = await context.setupUser()
      await context.setupMcpPool({ user, workspace, name: 'pool1' })
      await context.setupMcpPool({ user, workspace, name: 'pool2' })
      await context.setupMcpPool({ user, workspace, name: 'pool3' })
      const results = await searchMcpPools.call(context.moduleMcp, { user, workspace, page: 3, limit: 1, order: { name: 'DESC' } })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('pool1')
    })

    it('should sanitize special characters from search string', async(context) => {
      const { user, workspace } = await context.setupUser()
      await context.setupMcpPool({ user, workspace, name: 'pool' })
      const results = await searchMcpPools.call(context.moduleMcp, { user, workspace, search: 'po!ol' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('pool')
    })

    it('should preserve spaces and alphanumeric characters', async(context) => {
      const { user, workspace } = await context.setupUser()
      await context.setupMcpPool({ user, workspace, name: 'pool 123' })
      const results = await searchMcpPools.call(context.moduleMcp, { user, workspace, search: 'pool 123' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('pool 123')
    })

    it('should ignore search when length is less than 3', async(context) => {
      const { user, workspace } = await context.setupUser()
      await context.setupMcpPool({ user, workspace, name: 'pool' })
      const results = await searchMcpPools.call(context.moduleMcp, { user, workspace, search: 'xx' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('pool')
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw a "AssertionError" if workspace is not provided', async({ moduleMcp }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchMcpPools.call(moduleMcp, { search: 'pool' })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw a "AssertionError" if search is invalid', async(context) => {
      const { user, workspace } = await context.setupUser()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchMcpPools.call(context.moduleMcp, { user, workspace, search: 123 })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw a "AssertionError" if search is not a string', async(context) => {
      const { user, workspace } = await context.setupUser()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchMcpPools.call(context.moduleMcp, { user, workspace, search: ['pool'] })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw a "AssertionError" if page is invalid', async(context) => {
      const { user, workspace } = await context.setupUser()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchMcpPools.call(context.moduleMcp, { user, workspace, page: '1' })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw a "AssertionError" if limit is invalid', async(context) => {
      const { user, workspace } = await context.setupUser()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchMcpPools.call(context.moduleMcp, { user, workspace, limit: '10' })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw a "AssertionError" if user is invalid', async(context) => {
      const { workspace } = await context.setupUser()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchMcpPools.call(context.moduleMcp, { workspace, user: 'user' })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw a "AssertionError" if user is not provided', async(context) => {
      const { workspace } = await context.setupUser()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchMcpPools.call(context.moduleMcp, { workspace })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw a "AssertionError" if order is invalid', async(context) => {
      const { user, workspace } = await context.setupUser()
      // @ts-expect-error: testing invalid input
      const shouldReject = () => searchMcpPools.call(context.moduleMcp, { user, workspace, order: 'order' })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })
  })
})
