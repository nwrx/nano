import { type Context, createTestContext } from '../../__fixtures__'
import { createMcpPool } from './createMcpPool'
import { getMcpManagerClient } from './getMcpManagerClient'
import { registerManager } from './registerManager'

const address = 'http://localhost:8081'

describe<Context>('createMcpPool', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  describe<Context>('pool creation', (it) => {
    it('should create an MCP pool with default values', async({ setupUser, moduleMcp }) => {
      const { workspace, user } = await setupUser()
      const manager = await registerManager.call(moduleMcp, { address, user })
      const pool = await createMcpPool.call(moduleMcp, { user, workspace, manager })
      expect(pool).toMatchObject({
        name: 'default',
        title: 'default',
        workspace: { id: workspace.id },
        manager: { id: manager.id },
        createdBy: { id: user.id },
        assignments: [{
          user: { id: user.id },
          createdBy: { id: user.id },
        }],
      })
    })

    it('should create an MCP pool with custom name', async({ setupUser, moduleMcp }) => {
      const { user, workspace } = await setupUser()
      const manager = await registerManager.call(moduleMcp, { address, user })
      const pool = await createMcpPool.call(moduleMcp, {
        user,
        workspace,
        manager,
        name: 'production',
      })
      expect(pool).toMatchObject({
        name: 'production',
        title: 'production',
        workspace: { id: workspace.id },
        manager: { id: manager.id },
        createdBy: { id: user.id },
        assignments: [{
          user: { id: user.id },
          createdBy: { id: user.id },
        }],
      })
    })

    it('should store the pool in the database', async({ setupUser, moduleMcp }) => {
      const { user, workspace } = await setupUser()
      const manager = await registerManager.call(moduleMcp, { address, user })
      const pool = await createMcpPool.call(moduleMcp, { user, workspace, manager })
      const { McpPool } = moduleMcp.getRepositories()
      const count = await McpPool.countBy({ id: pool.id })
      expect(count).toBe(1)
    })

    it('should create the pool in the Kubernetes cluster', async({ setupUser, moduleMcp }) => {
      const { user, workspace } = await setupUser()
      const manager = await registerManager.call(moduleMcp, { address, user })
      const pool = await createMcpPool.call(moduleMcp, { user, workspace, manager })
      const client = await getMcpManagerClient.call(moduleMcp, manager)
      const poolFromKube = await client.getPool(pool.id)
      expect(poolFromKube).toMatchObject({ name: pool.id })
    })

    it('should create pool assignment for the user', async({ setupUser, moduleMcp }) => {
      const { user, workspace } = await setupUser()
      const manager = await registerManager.call(moduleMcp, { address, user })
      const pool = await createMcpPool.call(moduleMcp, { user, workspace, manager })
      const { McpPoolAssignment } = moduleMcp.getRepositories()
      const count = await McpPoolAssignment.countBy({ pool: { id: pool.id }, user: { id: user.id } })
      expect(count).toBe(1)
    })
  })

  describe<Context>('conflict', (it) => {
    it('should throw an error if pool with same name already exists', async({ setupUser, moduleMcp }) => {
      const { user, workspace } = await setupUser()
      const manager = await registerManager.call(moduleMcp, { address, user })
      await createMcpPool.call(moduleMcp, { user, workspace, manager, name: 'test-pool' })
      const shouldReject = () => createMcpPool.call(moduleMcp, { user, workspace, manager, name: 'test-pool' })
      const error = moduleMcp.errors.MCP_POOL_ALREADY_EXISTS(workspace.name, 'test-pool')
      await expect(shouldReject).rejects.toThrow(error)
    })
  })
})
