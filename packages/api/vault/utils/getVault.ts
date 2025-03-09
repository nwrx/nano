import type { Loose } from '@unshared/types'
import type { ModuleVault } from '..'
import type { Vault } from '../entities'
import { assert, createSchema } from '@unshared/validation'
import { In } from 'typeorm'
import { assertUser } from '../../user/utils/assertUser'
import { assertWorkspace } from '../../workspace/utils/assertWorkspace'
import { assertVaultPermission } from './assertVaultPermission'

/** The schema for the getVault options. */
const GET_VAULT_OPTIONS_SCHEMA = createSchema({
  user: assertUser,
  workspace: assertWorkspace,
  name: assert.stringNotEmpty,
  permission: assertVaultPermission,
  withDeleted: [[assert.undefined], [assert.boolean]],
  withProjects: [[assert.undefined], [assert.boolean]],
  withAssignments: [[assert.undefined], [assert.boolean]],
})

/** The options to get a vault by name. */
export type GetVaultOptions = Loose<ReturnType<typeof GET_VAULT_OPTIONS_SCHEMA>>

/**
 * Get a vault by name. The vault configuration will only be included if the user
 * has the required permissions to access the vault configuration.
 *
 * @param options The options for getting the vault
 * @returns The vault
 */
export async function getVault(this: ModuleVault, options: GetVaultOptions): Promise<Vault> {
  const {
    user,
    workspace,
    name,
    permission,
    withDeleted,
    withProjects,
    withAssignments,
  } = GET_VAULT_OPTIONS_SCHEMA(options)

  // --- Get the vault entity.
  const { Vault } = this.getRepositories()
  const vault = await Vault.findOne({
    where: {
      name,
      workspace,
      assignments: { user, permission: In(['Owner', 'Read']) },
    },
    relations: {
      projects: withProjects ? { project: true } : false,
      assignments: withAssignments ? { user: true } : false,
    },
    withDeleted,
  })

  // --- Return early if the user has read access.
  if (!vault) throw this.errors.VAULT_NOT_FOUND(workspace.name, name)
  if (permission === 'Read') return vault

  // --- Assert that the user has an assignment that matches the permission.
  const { VaultAssignment } = this.getRepositories()
  const isAllowed = await VaultAssignment.countBy({ user, vault, permission: In(['Owner', permission]) })
  if (!isAllowed) throw this.errors.VAULT_FORBIDDEN(workspace.name, name)
  return vault
}
