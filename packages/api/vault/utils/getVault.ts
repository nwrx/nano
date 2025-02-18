import type { Loose } from '@unshared/types'
import type { ModuleVault } from '..'
import type { Vault } from '../entities'
import { assertBoolean, assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'
import { assertVaultPermission } from './assertVaultPermission'

/** The schema for the getVault options. */
const GET_VAULT_OPTIONS_SCHEMA = createSchema({

  /** The `name` of the {@linkcode Vault} to find. */
  name: assertStringNotEmpty,

  /** The `User` responsible for the request. */
  user: [createSchema({ id: assertStringUuid })],

  /** The `Workspace` where the vault is located. */
  workspace: createSchema({ id: assertStringUuid }),

  /** The permissions required to access the vault. */
  permission: assertVaultPermission,

  /** Weather to include the deleted vaults in the response. */
  withDeleted: [[assertUndefined], [assertBoolean]],

  /** Whether to include the vault variables in the response. */
  withVariables: [[assertUndefined], [assertBoolean]],

  /** Whether to include the vault configuration in the response. */
  withConfiguration: [[assertUndefined], [assertBoolean]],
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
    name,
    user,
    workspace,
    permission,
    withDeleted,
    withVariables,
    withConfiguration,
  } = GET_VAULT_OPTIONS_SCHEMA(options)

  // --- Get the vault entity.
  const { Vault } = this.getRepositories()
  const vault = await Vault.findOne({
    where: [
      { name, workspace: { assignments: { user, permission: 'Owner' } } },
      { name, workspace, assignments: { user } },
      { name, workspace, flowAssignments: { flow: { assignments: { user } } } },
      { name, workspace, projectAssignments: { project: { assignments: { user } } } },
    ],
    relations: {
      workspace: { assignments: { user: true } },
      assignments: { user: true },
      flowAssignments: { flow: { assignments: { user: true } } },
      projectAssignments: { project: { assignments: { user: true } } },
      variables: withVariables,
      configuration: withConfiguration,
    },
    withDeleted,
  })

  // --- Assert that the vault exists and the user has access.
  if (!vault) throw this.errors.VAULT_NOT_FOUND(name)
  if (user && permission === 'Read') {
    delete vault.assignments
    delete vault.variables
    return vault
  }

  if (!user) throw this.errors.VAULT_ACTION_NOT_ALLOWED(name)
  for (const assignment of vault.assignments!) {
    if (assignment.user.id !== user.id) continue
    if (assignment.permission === 'Owner') return vault
    if (assignment.permission === permission) return vault
  }

  // --- Ensure the vault exists and return it.
  throw this.errors.VAULT_ACTION_NOT_ALLOWED(name)
}
