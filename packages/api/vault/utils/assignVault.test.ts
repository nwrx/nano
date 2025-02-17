import type { Context } from '../../__fixtures__'
import type { AssignVaultOptions } from './assignVault'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { VaultAssignment } from '../entities'
import { assignVault } from './assignVault'

describe.concurrent<Context>('assignVault', { timeout: 300 }, () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('assignVault', (it) => {
    it('should assign a vault to a user', async({ createUser, createVault, moduleVault }) => {
      const { user: owner, workspace } = await createUser('owner')
      const { user: assignee } = await createUser()
      const { vault } = await createVault('vault', owner, workspace)
      const options = { user: owner, assignee, vault, permission: 'Read' }
      const assignment = await assignVault.call(moduleVault, options as AssignVaultOptions)

      expect(assignment).toBeInstanceOf(VaultAssignment)
      expect(assignment).toMatchObject({
        id: assignment.id,
        user: { id: assignee.id },
        vault: { id: vault.id },
        permission: 'Read',
        createdBy: { id: owner.id },
      })
    })

    it('should save the assignment to the database', async({ createUser, createVault, moduleVault }) => {
      const { user: owner, workspace } = await createUser('owner')
      const { user: assignee } = await createUser()
      const { vault } = await createVault('vault', owner, workspace)
      const options = { user: owner, assignee, vault, permission: 'Read' }
      const assignment = await assignVault.call(moduleVault, options as AssignVaultOptions)

      const { VaultAssignment } = moduleVault.getRepositories()
      const found = await VaultAssignment.findOneBy({ id: assignment.id })
      expect(found).toMatchObject({ id: assignment.id })
    })
  })

  describe('validation', () => {
    describe<Context>('user', (it) => {
      it('should throw if user is missing', async({ createUser, createVault, moduleVault }) => {
        const { user: owner, workspace } = await createUser('owner')
        const { user: assignee } = await createUser()
        const { vault } = await createVault('vault', owner, workspace)
        const options = { assignee, vault, permission: 'Read' }
        // @ts-expect-error: testing invalid options
        const shouldThrow = assignVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if user.id is not a UUID', async({ createUser, createVault, moduleVault }) => {
        const { user: owner, workspace } = await createUser('owner')
        const { user: assignee } = await createUser()
        const { vault } = await createVault('vault', owner, workspace)
        const options = { user: { id: 'invalid' }, assignee, vault, permission: 'Read' }
        // @ts-expect-error: testing invalid options
        const shouldThrow = assignVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('assignee', (it) => {
      it('should throw if assignee is missing', async({ createUser, createVault, moduleVault }) => {
        const { user: owner, workspace } = await createUser()
        const { vault } = await createVault('vault', owner, workspace)
        const options = { user: owner, vault, permission: 'Read' }
        // @ts-expect-error: testing invalid options
        const shouldThrow = assignVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if assignee.id is not a UUID', async({ createUser, createVault, moduleVault }) => {
        const { user: owner, workspace } = await createUser()
        const { vault } = await createVault('vault', owner, workspace)
        const options = { user: owner, assignee: { id: 'invalid' }, vault, permission: 'Read' }
        // @ts-expect-error: testing invalid options
        const shouldThrow = assignVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('vault', (it) => {
      it('should throw if vault is missing', async({ createUser, moduleVault }) => {
        const { user: owner } = await createUser('owner')
        const { user: assignee } = await createUser()
        const options = { user: owner, assignee, permission: 'Read' }
        // @ts-expect-error: testing invalid options
        const shouldThrow = assignVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if vault.id is not a UUID', async({ createUser, moduleVault }) => {
        const { user: owner } = await createUser('owner')
        const { user: assignee } = await createUser()
        const options = { user: owner, assignee, vault: { id: 'invalid' }, permission: 'Read' }
        // @ts-expect-error: testing invalid options
        const shouldThrow = assignVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })

    describe<Context>('permission', (it) => {
      it('should throw if permission is missing', async({ createUser, createVault, moduleVault }) => {
        const { user: owner, workspace } = await createUser('owner')
        const { user: assignee } = await createUser()
        const { vault } = await createVault('vault', owner, workspace)
        const options = { user: owner, assignee, vault }
        // @ts-expect-error: testing invalid options
        const shouldThrow = assignVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })

      it('should throw if permission is invalid', async({ createUser, createVault, moduleVault }) => {
        const { user: owner, workspace } = await createUser('owner')
        const { user: assignee } = await createUser()
        const { vault } = await createVault('vault', owner, workspace)
        const options = { user: owner, assignee, vault, permission: 'Invalid' }
        // @ts-expect-error: testing invalid options
        const shouldThrow = assignVault.call(moduleVault, options)
        await expect(shouldThrow).rejects.toThrow(ValidationError)
      })
    })
  })
})
