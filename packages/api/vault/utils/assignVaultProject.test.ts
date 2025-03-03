import type { Context } from '../../__fixtures__'
import type { AssignVaultProjectOptions } from './assignVaultProject'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { VaultProjectAssignment } from '../entities'
import { assignVaultProject } from './assignVaultProject'
import { ERRORS } from './errors'

describe.concurrent<Context>('assignVaultProject', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('result', (it) => {
    it('should assign a vault to a project', async({ setupUser, setupVault, setupProject, moduleVault }) => {
      const { user, workspace } = await setupUser()
      const { vault } = await setupVault({ user, workspace })
      const { project } = await setupProject({ user, workspace })
      const options = { user, project, vault, workspace, permission: 'Read' }
      const assignment = await assignVaultProject.call(moduleVault, options as AssignVaultProjectOptions)
      expect(assignment).toBeInstanceOf(VaultProjectAssignment)
      expect(assignment).toMatchObject({
        id: assignment.id,
        project: { id: project.id },
        vault: { id: vault.id },
        permission: 'Read',
        createdBy: { id: user.id },
      })
    })

    it('should not save the assignment to the database', async({ setupUser, setupVault, setupProject, moduleVault }) => {
      const { user, workspace } = await setupUser()
      const { vault } = await setupVault({ user, workspace })
      const { project } = await setupProject({ user, workspace })
      const options = { user, project, vault, workspace, permission: 'Read' }
      await assignVaultProject.call(moduleVault, options as AssignVaultProjectOptions)
      const count = await moduleVault.getRepositories().VaultProjectAssignment.countBy({ vault })
      expect(count).toBe(0)
    })
  })

  describe<Context>('database', (it) => {
    it('should save the assignment to the database', async({ setupUser, setupVault, setupProject, moduleVault }) => {
      const { user, workspace } = await setupUser()
      const { vault } = await setupVault({ user, workspace })
      const { project } = await setupProject({ user, workspace })
      const options = { user, project, vault, workspace, permission: 'Read' }
      const assignment = await assignVaultProject.call(moduleVault, options as AssignVaultProjectOptions)
      await moduleVault.getRepositories().VaultProjectAssignment.save(assignment)
      const { VaultProjectAssignment } = moduleVault.getRepositories()
      const found = await VaultProjectAssignment.findOneBy({ id: assignment.id })
      expect(found).toMatchObject({ id: assignment.id })
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw if the vault is already assigned to the project', async({ setupUser, setupVault, setupProject, moduleVault }) => {
      const { user, workspace } = await setupUser()
      const { vault } = await setupVault({ user, workspace })
      const { project } = await setupProject({ user, workspace })
      const options = { user, project, vault, workspace, permission: 'Read' }
      const assignment = await assignVaultProject.call(moduleVault, options as AssignVaultProjectOptions)
      await moduleVault.getRepositories().VaultProjectAssignment.save(assignment)
      const shouldThrow = assignVaultProject.call(moduleVault, options as AssignVaultProjectOptions)
      const error = ERRORS.VAULT_USER_ALREADY_ASSIGNED(workspace.name, vault.name, project.name)
      await expect(shouldThrow).rejects.toThrowError(error)
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw if user is missing', async({ setupWorkspace, setupVault, setupProject, moduleVault }) => {
      const { workspace } = await setupWorkspace()
      const { vault } = await setupVault({ workspace })
      const { project } = await setupProject({ workspace })
      const options = { project, vault, workspace, permission: 'Read' }
      // @ts-expect-error: testing invalid options
      const shouldThrow = assignVaultProject.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(ValidationError)
    })

    it('should throw if project is missing', async({ setupUser, setupWorkspace, setupVault, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      const { vault } = await setupVault({ user, workspace })
      const options = { user, vault, workspace, permission: 'Read' }
      // @ts-expect-error: testing invalid options
      const shouldThrow = assignVaultProject.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(ValidationError)
    })

    it('should throw if vault is missing', async({ setupUser, setupWorkspace, setupProject, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      const { project } = await setupProject({ user, workspace })
      const options = { user, project, workspace, permission: 'Read' }
      // @ts-expect-error: testing invalid options
      const shouldThrow = assignVaultProject.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(ValidationError)
    })

    it('should throw if workspace is missing', async({ setupUser, setupVault, setupProject, moduleVault }) => {
      const { user } = await setupUser()
      const { vault } = await setupVault({ user })
      const { project } = await setupProject({ user })
      const options = { user, project, vault, permission: 'Read' }
      // @ts-expect-error: testing invalid options
      const shouldThrow = assignVaultProject.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(ValidationError)
    })

    it('should throw if permission is missing', async({ setupUser, setupWorkspace, setupVault, setupProject, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      const { vault } = await setupVault({ user, workspace })
      const { project } = await setupProject({ user, workspace })
      const options = { user, project, vault, workspace }
      // @ts-expect-error: testing invalid options
      const shouldThrow = assignVaultProject.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(ValidationError)
    })

    it('should throw if permission is invalid', async({ setupUser, setupWorkspace, setupVault, setupProject, moduleVault }) => {
      const { user } = await setupUser()
      const { workspace } = await setupWorkspace()
      const { vault } = await setupVault({ user, workspace })
      const { project } = await setupProject({ user, workspace })
      const options = { user, project, vault, workspace, permission: 'Invalid' }
      // @ts-expect-error: testing invalid options
      const shouldThrow = assignVaultProject.call(moduleVault, options)
      await expect(shouldThrow).rejects.toThrow(ValidationError)
    })
  })
})
