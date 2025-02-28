import type { Context } from '../../__fixtures__'
import type { VaultLocalOptions } from '../adapters'
import { createTestContext } from '../../__fixtures__'

describe.concurrent('POST /api/workspaces/:workspace/vaults', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  const configuration: VaultLocalOptions = {
    algorithm: 'aes-256-gcm',
    secret: 'secret-key',
  }

  describe<Context>('as workspace owner', (it) => {
    it('should respond with status 201', async({ setupUser, application }) => {
      const { workspace, headers } = await setupUser()
      const body = JSON.stringify({ name: 'my-vault', type: 'local', configuration })
      const response = await application.fetch(`/api/workspaces/${workspace.name}/vaults`, { method: 'POST', body, headers })
      const data = await response.text()
      expect(response).toMatchObject({ status: 201, statusText: 'Created' })
      expect(data).toBe('')
    })

    it('should create a vault in the database', async({ setupUser, moduleVault, application }) => {
      const { workspace, headers } = await setupUser()
      const body = JSON.stringify({ name: 'my-vault', type: 'local', configuration })
      await application.fetch(`/api/workspaces/${workspace.name}/vaults`, { method: 'POST', body, headers })
      const { Vault } = moduleVault.getRepositories()
      const result = await Vault.findOne({ where: { name: 'my-vault' } })
      expect(result).toMatchObject({ name: 'my-vault', type: 'local' })
    })

    it('should create an owner assignment for the user', async({ setupUser, moduleVault, application }) => {
      const { user, workspace, headers } = await setupUser()
      const body = JSON.stringify({ name: 'my-vault', type: 'local', configuration })
      await application.fetch(`/api/workspaces/${workspace.name}/vaults`, { method: 'POST', body, headers })
      const { VaultAssignment } = moduleVault.getRepositories()
      const result = await VaultAssignment.findOne({ where: { user }, relations: { user: true } })
      expect(result).toMatchObject({ user: { id: user.id }, permission: 'Owner' })
    })

    it('should respond with E_VAULT_ALREADY_EXISTS if vault name is taken', async({ setupUser, setupVault, application }) => {
      const { user, workspace, headers } = await setupUser()
      await setupVault({ user, workspace, name: 'my-vault' })
      const body = JSON.stringify({ name: 'my-vault', type: 'local', configuration })
      const response = await application.fetch(`/api/workspaces/${workspace.name}/vaults`, { method: 'POST', body, headers })
      const data = await response.json() as Record<string, unknown>
      expect(response.status).toBe(409)
      expect(data).toMatchObject({ data: { name: 'E_VAULT_ALREADY_EXISTS' } })
    })

    it('should respond with E_WORKSPACE_NOT_FOUND if workspace does not exist', async({ setupUser, application }) => {
      const { headers } = await setupUser()
      const body = JSON.stringify({ name: 'my-vault', type: 'local', configuration })
      const response = await application.fetch('/api/workspaces/unknown/vaults', { method: 'POST', body, headers })
      const data = await response.json() as Record<string, unknown>
      expect(response.status).toBe(404)
      expect(data).toMatchObject({ data: { name: 'E_WORKSPACE_NOT_FOUND' } })
    })
  })

  describe<Context>('as workspace writer', (it) => {
    it('should respond with E_WORKSPACE_PERMISSION_DENIED without write permission', async({ setupUser, setupWorkspace, application }) => {
      const { user, headers } = await setupUser()
      const { workspace } = await setupWorkspace({ assignments: [[user, 'Owner']] })
      const body = JSON.stringify({ name: 'my-vault', type: 'local', configuration })
      const response = await application.fetch(`/api/workspaces/${workspace.name}/vaults`, { method: 'POST', body, headers })
      expect(response.status).toBe(201)
    })
  })

  describe<Context>('as workspace reader', (it) => {
    it('should respond with E_WORKSPACE_PERMISSION_DENIED without write permission', async({ setupUser, setupWorkspace, application }) => {
      const { user, headers } = await setupUser()
      const { workspace } = await setupWorkspace({ assignments: [[user, 'Read']] })
      const body = JSON.stringify({ name: 'my-vault', type: 'local', configuration })
      const response = await application.fetch(`/api/workspaces/${workspace.name}/vaults`, { method: 'POST', body, headers })
      const data = await response.json() as Record<string, unknown>
      expect(response.status).toBe(401)
      expect(data).toMatchObject({ data: { name: 'E_WORKSPACE_ACTION_NOT_AUTHORIZED' } })
    })
  })

  describe<Context>('with unauthenticated user', (it) => {
    it('should respond with E_USER_UNAUTHORIZED', async({ setupUser, application }) => {
      const { workspace } = await setupUser()
      const body = JSON.stringify({ name: 'my-vault', type: 'local', configuration })
      const response = await application.fetch(`/api/workspaces/${workspace.name}/vaults`, { method: 'POST', body })
      const data = await response.json() as Record<string, unknown>
      expect(response.status).toBe(401)
      expect(data).toMatchObject({ data: { name: 'E_USER_UNAUTHORIZED' } })
    })
  })

  describe<Context>('validation', (it) => {
    it('should validate vault name format', async({ setupUser, application }) => {
      const { workspace, headers } = await setupUser()
      const body = JSON.stringify({ name: 'invalid name', type: 'local', configuration })
      const response = await application.fetch(`/api/workspaces/${workspace.name}/vaults`, { method: 'POST', body, headers })
      expect(response.status).toBe(400)
      expect(await response.text()).toContain('E_STRING_NOT_KEBAB_CASE')
    })

    it('should validate vault type', async({ setupUser, application }) => {
      const { workspace, headers } = await setupUser()
      const body = JSON.stringify({ name: 'my-vault', type: 'invalid', configuration })
      const response = await application.fetch(`/api/workspaces/${workspace.name}/vaults`, { method: 'POST', body, headers })
      expect(response.status).toBe(400)
      expect(await response.text()).toContain('E_STRING_NOT_ONE_OF_VALUES')
    })

    it('should validate configuration', async({ setupUser, application }) => {
      const { workspace, headers } = await setupUser()
      const body = JSON.stringify({ name: 'my-vault', type: 'local', configuration: 'invalid' })
      const response = await application.fetch(`/api/workspaces/${workspace.name}/vaults`, { method: 'POST', body, headers })
      expect(response.status).toBe(400)
      expect(await response.text()).toContain('E_NOT_OBJECT')
    })
  })
})
