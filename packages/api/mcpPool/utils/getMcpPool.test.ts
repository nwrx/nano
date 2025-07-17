/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import type { McpPoolPermission } from './assertMcpPoolPermission'
import { AssertionError, EXP_UUID } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { MCP_POOL_PERMISSIONS } from './assertMcpPoolPermission'
import { ERRORS as E } from './errors'
import { getMcpPool } from './getMcpPool'

interface TestMatrixOptions {
  permission: McpPoolPermission
  withAccess?: McpPoolPermission
  withPermission?: McpPoolPermission
}

async function createResult(context: Context, options: TestMatrixOptions) {
  const { permission, withAccess, withPermission } = options
  const { user } = await context.setupUser()
  const { workspace } = await context.setupWorkspace({ name: 'workspace' })
  const { pool } = await context.setupMcpPool({ name: 'pool', workspace, assignments: [[user, withAccess, withPermission]] })
  return await getMcpPool.call(context.moduleMcp, { user, workspace, name: pool.name, permission })
}

describe('getMcpPool', () => {
  beforeEach<Context>(createTestContext)

  const MCP_POOL_READ_PERMISSIONS = ['Read', 'Owner'] as McpPoolPermission[]
  const MCP_POOL_EXTRA_PERMISSIONS = MCP_POOL_PERMISSIONS.filter(permission => !MCP_POOL_READ_PERMISSIONS.includes(permission))

  // With or without read access
  for (const withAccess of [...MCP_POOL_READ_PERMISSIONS, undefined]) {
    describe<Context>(withAccess ? `with user with ${withAccess} access` : 'with user without read access', () => {

      // With additional permission or not
      for (const withPermission of [...MCP_POOL_EXTRA_PERMISSIONS, undefined]) {
        describe<Context>(withPermission ? `with user with ${withPermission} permission` : 'with user without extra permission', (it) => {

          // Iterate over all possible request permissions
          for (const permission of MCP_POOL_PERMISSIONS) {
            const canRead = withAccess === 'Owner' || withAccess === 'Read'
            const canAccess = (permission === 'Read' && canRead) || permission === withPermission || withAccess === 'Owner'

            if (canRead && canAccess) {
              it(`should return the pool when the request permission is "${permission}"`, async(context) => {
                const result = await createResult(context, { permission, withAccess, withPermission })
                expect(result).toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'pool' })
              })
            }
            else if (canRead) {
              it(`should throw "MCP_POOL_FORBIDDEN" when the request permission is "${permission}"`, async(context) => {
                const shouldReject = createResult(context, { permission, withAccess, withPermission })
                const error = E.MCP_POOL_FORBIDDEN('workspace', 'pool')
                await expect(shouldReject).rejects.toThrow(error)
              })
            }
            else {
              it(`should throw "MCP_POOL_NOT_FOUND" when the request permission is "${permission}"`, async(context) => {
                const shouldReject = createResult(context, { permission, withAccess, withPermission })
                const error = E.MCP_POOL_NOT_FOUND('workspace', 'pool')
                await expect(shouldReject).rejects.toThrow(error)
              })
            }
          }
        })
      }
    })
  }

  describe<Context>('withDeleted', (it) => {
    it('should return the pool when withDeleted is true', async(context) => {
      const { user } = await context.setupUser()
      const { workspace } = await context.setupWorkspace({ name: 'workspace' })
      const { pool } = await context.setupMcpPool({ name: 'pool', workspace, assignments: [[user, 'Read']] })
      await context.moduleMcp.getRepositories().McpPool.softRemove(pool)
      const result = await getMcpPool.call(context.moduleMcp, { user, workspace, name: pool.name, permission: 'Read', withDeleted: true })
      expect(result).toMatchObject({ id: expect.stringMatching(EXP_UUID), name: 'pool' })
    })

    it('should not return the pool when withDeleted is false', async(context) => {
      const { user } = await context.setupUser()
      const { workspace } = await context.setupWorkspace({ name: 'workspace' })
      const { pool } = await context.setupMcpPool({ name: 'pool', workspace, assignments: [[user, 'Read']] })
      await context.moduleMcp.getRepositories().McpPool.softRemove(pool)
      const shouldReject = getMcpPool.call(context.moduleMcp, { user, workspace, name: pool.name, permission: 'Read', withDeleted: false })
      const error = E.MCP_POOL_NOT_FOUND('workspace', 'pool')
      await expect(shouldReject).rejects.toThrow(error)
    })
  })

  describe<Context>('edge cases', (it) => {
    it('should throw "MCP_POOL_NOT_FOUND" if the pool is not found', async({ moduleMcp, setupWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      const shouldReject = getMcpPool.call(moduleMcp, { user, workspace, name: 'not-found', permission: 'Read' })
      const error = moduleMcp.errors.MCP_POOL_NOT_FOUND(workspace.name, 'not-found')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw "MCP_POOL_FORBIDDEN" for multiple users with different access levels', async(context) => {
      const { user: user1 } = await context.setupUser()
      const { user: user2 } = await context.setupUser()
      const { workspace } = await context.setupWorkspace()
      const { pool } = await context.setupMcpPool({ name: 'shared-pool', workspace, assignments: [[user1, 'Read'], [user2, 'Write']] })

      // User 1 with Read access requesting Write permission
      const shouldRejectUser1 = getMcpPool.call(context.moduleMcp, { user: user1, workspace, name: pool.name, permission: 'Write' })
      const error1 = E.MCP_POOL_FORBIDDEN(workspace.name, pool.name)
      await expect(shouldRejectUser1).rejects.toThrow(error1)

      // User 2 with Write access requesting Read permission
      const shouldRejectUser2 = getMcpPool.call(context.moduleMcp, { user: user2, workspace, name: pool.name, permission: 'Read' })
      const error2 = E.MCP_POOL_NOT_FOUND(workspace.name, pool.name)
      await expect(shouldRejectUser2).rejects.toThrow(error2)
    })
  })

  describe<Context>('assertion errors', (it) => {
    it('should throw a "AssertionError" if the request permission is not provided', async({ moduleMcp, setupWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getMcpPool.call(moduleMcp, { user, workspace, name: 'pool', permission: undefined })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw a "AssertionError" if the request permission is invalid', async({ moduleMcp, setupWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getMcpPool.call(moduleMcp, { user, workspace, name: 'pool', permission: 'Invalid' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw a "AssertionError" if pool name is empty', async({ moduleMcp, setupWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      const shouldReject = getMcpPool.call(moduleMcp, { user, workspace, name: '', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw a "AssertionError" if the user is not provided', async({ moduleMcp, setupWorkspace }) => {
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getMcpPool.call(moduleMcp, { workspace, name: 'pool', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw a "AssertionError" if the user does not have an "id" property', async({ moduleMcp, setupWorkspace }) => {
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getMcpPool.call(moduleMcp, { user: {}, workspace, name: 'pool', permission: 'Read' })
      await expect(shouldReject).rejects.toThrowError(AssertionError)
    })

    it('should throw a "AssertionError" if workspace is not provided', async({ moduleMcp, setupUser }) => {
      const { user } = await setupUser()
      // @ts-expect-error: testing invalid input
      const shouldReject = getMcpPool.call(moduleMcp, { user, name: 'pool', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw a "AssertionError" if withDeleted is not a boolean', async({ moduleMcp, setupWorkspace, setupUser }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      // @ts-expect-error: testing invalid input
      const shouldReject = getMcpPool.call(moduleMcp, { user, workspace, name: 'pool', permission: 'Read', withDeleted: 'yes' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })
  })
})
