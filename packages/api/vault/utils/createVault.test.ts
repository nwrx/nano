/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import type { VaultLocalOptions } from '../adapters'
import type { CreateVaultOptions } from './createVault'
import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { createTestContext } from '../../__fixtures__'
import { Vault } from '../entities'
import { createVault } from './createVault'

describe.concurrent<Context>('createVault', { timeout: 300 }, () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  const configuration: VaultLocalOptions = {
    algorithm: 'aes-256-gcm',
    secret: 'secret-key',
  }

  describe<Context>('createVault', (it) => {
    it('should create a vault', async({ createUser, moduleVault }) => {
      const { user, workspace } = await createUser()
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

    it('should save the vault to the database', async({ createUser, moduleVault }) => {
      const { user, workspace } = await createUser()
      const options = { user, name: 'vault', type: 'local', workspace, configuration }
      const vault = await createVault.call(moduleVault, options as CreateVaultOptions)
      const { Vault } = moduleVault.getRepositories()
      const found = await Vault.findOneBy({ id: vault.id })
      expect(found).toMatchObject({ id: vault.id })
    })

    it('should create a vault with a description', async({ createUser, moduleVault }) => {
      const { user, workspace } = await createUser()
      const options = { user, name: 'vault', type: 'local', workspace, description: 'description', configuration }
      const vault = await createVault.call(moduleVault, options as CreateVaultOptions)
      expect(vault).toMatchObject({ description: 'description' })
    })

    it('should assign the user as the owner of the vault', async({ createUser, moduleVault }) => {
      const { user, workspace } = await createUser()
      const options = { user, name: 'vault', type: 'local', workspace, configuration }
      const vault = await createVault.call(moduleVault, options as CreateVaultOptions)
      expect(vault.assignments).toHaveLength(1)
      expect(vault.assignments![0]).toMatchObject({ user: { id: user.id }, permission: 'Owner' })
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw if vault already exists', async({ createUser, moduleVault }) => {
      const { user, workspace } = await createUser()
      const options = { user, name: 'vault', type: 'local', workspace, configuration }
      await createVault.call(moduleVault, options as CreateVaultOptions)
      const shouldThrow = createVault.call(moduleVault, options as CreateVaultOptions)
      const error = moduleVault.errors.VAULT_ALREADY_EXISTS('vault', workspace.name)
      await expect(shouldThrow).rejects.toThrow(error)
    })
  })

  describe('validation', () => {
    describe<Context>('user', (it) => {
      it('should throw if user is missing', async({ createUser, moduleVault }) => {
        const { workspace } = await createUser()
        const options = { name: 'vault', type: 'local', workspace, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if user is not an object', async({ createUser, moduleVault }) => {
        const { workspace } = await createUser()
        const options = { user: 'invalid', name: 'vault', type: 'local', workspace, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if user is missing id', async({ createUser, moduleVault }) => {
        const { workspace } = await createUser()
        const options = { user: {}, name: 'vault', type: 'local', workspace, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if user id is not a UUID', async({ createUser, moduleVault }) => {
        const { workspace } = await createUser()
        const options = { user: { id: 'invalid' }, name: 'vault', type: 'local', workspace, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('type', (it) => {
      it('should throw if type is missing', async({ createUser, moduleVault }) => {
        const { user, workspace } = await createUser()
        const options = { user, name: 'vault', workspace, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if type is invalid', async({ createUser, moduleVault }) => {
        const { user, workspace } = await createUser()
        const options = { user, name: 'vault', type: 'invalid', workspace, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('name', (it) => {
      it('should throw if name is missing', async({ createUser, moduleVault }) => {
        const { user, workspace } = await createUser()
        const options = { user, type: 'local', workspace, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if name is not a string', async({ createUser, moduleVault }) => {
        const { user, workspace } = await createUser()
        const options = { user, name: 123, type: 'local', workspace, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if name is empty', async({ createUser, moduleVault }) => {
        const { user, workspace } = await createUser()
        const options = { user, name: '', type: 'local', workspace, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('description', (it) => {
      it('should throw if description is not a string', async({ createUser, moduleVault }) => {
        const { user, workspace } = await createUser()
        const options = { user, name: 'vault', type: 'local', workspace, description: 123, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should not throw if description is empty', async({ createUser, moduleVault }) => {
        const { user, workspace } = await createUser()
        const options = { user, name: 'vault', type: 'local', workspace, description: '', configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).resolves.not.toThrow()
      })
    })

    describe<Context>('workspace', (it) => {
      it('should throw if workspace is missing', async({ createUser, moduleVault }) => {
        const { user } = await createUser()
        const options = { user, name: 'vault', type: 'local', configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if workspace is not an object', async({ createUser, moduleVault }) => {
        const { user } = await createUser()
        const options = { user, name: 'vault', type: 'local', workspace: 'invalid', configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if workspace is missing id', async({ createUser, moduleVault }) => {
        const { user } = await createUser()
        const options = { user, name: 'vault', type: 'local', workspace: { name: 'workspace' }, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if workspace id is not a UUID', async({ createUser, moduleVault }) => {
        const { user } = await createUser()
        const options = { user, name: 'vault', type: 'local', workspace: { id: 'invalid', name: 'workspace' }, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if workspace is missing name', async({ createUser, moduleVault }) => {
        const { user } = await createUser()
        const options = { user, name: 'vault', type: 'local', workspace: { id: randomUUID() }, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if workspace name is not a string', async({ createUser, moduleVault }) => {
        const { user } = await createUser()
        const options = { user, name: 'vault', type: 'local', workspace: { id: randomUUID(), name: 123 }, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if workspace name is empty', async({ createUser, moduleVault }) => {
        const { user } = await createUser()
        const options = { user, name: 'vault', type: 'local', workspace: { id: randomUUID(), name: '' }, configuration }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('configuration', (it) => {
      it('should throw if configuration is missing', async({ createUser, moduleVault }) => {
        const { user, workspace } = await createUser()
        const options = { user, name: 'vault', type: 'local', workspace }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if configuration is not an object', async({ createUser, moduleVault }) => {
        const { user, workspace } = await createUser()
        const options = { user, name: 'vault', type: 'local', workspace, configuration: 'invalid' }
        // @ts-expect-error: testing invalid options
        const shouldThrow = createVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })
  })
})
