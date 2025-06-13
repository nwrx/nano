/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import type { VaultLocalOptions } from '../adapters'
import type { CreateVaultOptions } from './createVault'
import { AssertionError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { createTestContext } from '../../__fixtures__'
import { Vault } from '../entities'
import { createVault } from './createVault'

describe('createVault', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  const configuration: VaultLocalOptions = {
    algorithm: 'aes-256-gcm',
    secret: 'secret',
  }

  describe<Context>('result', (it) => {
    it('should create a vault', async({ setupUser, moduleVault }) => {
      const { user, workspace } = await setupUser()
      const options = { user, name: 'vault', type: 'local', workspace, configuration } as const
      const vault = await createVault.call(moduleVault, options as CreateVaultOptions)
      expect(vault).toBeInstanceOf(Vault)
      expect(vault).toMatchObject({
        id: vault.id,
        name: 'vault',
        type: 'local',
        workspace: { id: workspace.id },
        assignments: [{ user: { id: user.id }, permission: 'Owner' }],
        configuration: {
          algorithm: 'aes-256-gcm',
          iv: expect.any(String),
          salt: expect.any(String),
          tag: expect.any(String),
          cipher: expect.any(String),
        },
      })
    })

    it('should default the vault name to "default"', async({ setupUser, moduleVault }) => {
      const { user, workspace } = await setupUser()
      const options = { user, type: 'local', workspace, configuration } as const
      const vault = await createVault.call(moduleVault, options as CreateVaultOptions)
      expect(vault.name).toBe('default')
    })

    it('should default the vault type to "local"', async({ setupUser, moduleVault }) => {
      const { user, workspace } = await setupUser()
      const options = { user, name: 'vault', workspace, configuration } as const
      const vault = await createVault.call(moduleVault, options as CreateVaultOptions)
      expect(vault.type).toBe('local')
    })

    it('should not save the vault to the database', async({ setupUser, moduleVault }) => {
      const { user, workspace } = await setupUser()
      const options = { user, name: 'vault', type: 'local', workspace, configuration }
      await createVault.call(moduleVault, options as CreateVaultOptions)
      const count = await moduleVault.getRepositories().Vault.countBy({ name: 'vault' })
      expect(count).toBe(0)
    })

    it('should assign the user as the owner of the vault', async({ setupUser, moduleVault }) => {
      const { user, workspace } = await setupUser()
      const options = { user, name: 'vault', type: 'local', workspace, configuration }
      const vault = await createVault.call(moduleVault, options as CreateVaultOptions)
      expect(vault.assignments).toHaveLength(1)
      expect(vault.assignments![0]).toMatchObject({ user: { id: user.id }, permission: 'Owner' })
    })
  })

  describe<Context>('conflicts', (it) => {
    it('should throw if vault already exists in the workspace', async({ setupUser, moduleVault }) => {
      const { user, workspace } = await setupUser()
      const options = { user, name: 'vault', type: 'local', workspace, configuration }
      const vault = await createVault.call(moduleVault, options as CreateVaultOptions)
      await moduleVault.getRepositories().Vault.save(vault)
      const shouldThrow = createVault.call(moduleVault, options as CreateVaultOptions)
      const error = moduleVault.errors.VAULT_ALREADY_EXISTS(workspace.name, 'vault')
      await expect(shouldThrow).rejects.toThrow(error)
    })

    it('should allow the same vault name in different workspaces', async({ setupUser, setupWorkspace, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace: workspace1 } = await setupWorkspace()
      const { workspace: workspace2 } = await setupWorkspace()
      const options1 = { user, name: 'vault', type: 'local', workspace: workspace1, configuration }
      const options2 = { user, name: 'vault', type: 'local', workspace: workspace2, configuration }
      const vault1 = await createVault.call(moduleVault, options1 as CreateVaultOptions)
      const vault2 = await createVault.call(moduleVault, options2 as CreateVaultOptions)
      expect(vault1).not.toEqual(vault2)
    })
  })

  describe('validation', () => {
    describe<Context>('user', (it) => {
      it('should throw if user is missing', async({ setupUser, moduleVault }) => {
        const { workspace } = await setupUser()
        const options = { name: 'vault', type: 'local', workspace, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })
    })

    describe<Context>('type', (it) => {
      it('should throw if type is invalid', async({ setupUser, moduleVault }) => {
        const { user, workspace } = await setupUser()
        const options = { user, name: 'vault', type: 'invalid', workspace, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })
    })

    describe<Context>('name', (it) => {
      it('should throw if name is not a string', async({ setupUser, moduleVault }) => {
        const { user, workspace } = await setupUser()
        const options = { user, name: 123, type: 'local', workspace, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })

      it('should throw if name is empty', async({ setupUser, moduleVault }) => {
        const { user, workspace } = await setupUser()
        const options = { user, name: '', type: 'local', workspace, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })
    })

    describe<Context>('workspace', (it) => {
      it('should throw if workspace is missing', async({ setupUser, moduleVault }) => {
        const { user } = await setupUser()
        const options = { user, name: 'vault', type: 'local', configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })

      it('should throw if workspace is not an object', async({ setupUser, moduleVault }) => {
        const { user } = await setupUser()
        const options = { user, name: 'vault', type: 'local', workspace: 'invalid', configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })

      it('should throw if workspace is missing id', async({ setupUser, moduleVault }) => {
        const { user } = await setupUser()
        const options = { user, name: 'vault', type: 'local', workspace: { name: 'workspace' }, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })

      it('should throw if workspace id is not a UUID', async({ setupUser, moduleVault }) => {
        const { user } = await setupUser()
        const options = { user, name: 'vault', type: 'local', workspace: { id: 'invalid', name: 'workspace' }, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })

      it('should throw if workspace is missing name', async({ setupUser, moduleVault }) => {
        const { user } = await setupUser()
        const options = { user, name: 'vault', type: 'local', workspace: { id: randomUUID() }, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })

      it('should throw if workspace name is not a string', async({ setupUser, moduleVault }) => {
        const { user } = await setupUser()
        const options = { user, name: 'vault', type: 'local', workspace: { id: randomUUID(), name: 123 }, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })

      it('should throw if workspace name is empty', async({ setupUser, moduleVault }) => {
        const { user } = await setupUser()
        const options = { user, name: 'vault', type: 'local', workspace: { id: randomUUID(), name: '' }, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })
    })

    describe<Context>('configuration', (it) => {
      it('should throw if configuration is missing', async({ setupUser, moduleVault }) => {
        const { user, workspace } = await setupUser()
        const options = { user, name: 'vault', type: 'local', workspace }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })

      it('should throw if configuration is not an object', async({ setupUser, moduleVault }) => {
        const { user, workspace } = await setupUser()
        const options = { user, name: 'vault', type: 'local', workspace, configuration: 'invalid' }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(AssertionError)
      })
    })
  })
})
