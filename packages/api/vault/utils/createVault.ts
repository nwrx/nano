import type { Loose } from '@unshared/types'
import type { ModuleVault } from '..'
import type { Vault } from '../entities'
import type { VaultConfiguration } from './getVaultAdapter'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user'
import { encrypt } from '../../utils'
import { assertWorkspace } from '../../workspace'
import { assertVaultType } from './assertVaultType'

const CREATE_VAULT_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  workspace: assertWorkspace,
  type: assertVaultType,
  name: [[assert.undefined], [assert.stringNotEmpty]],
  configuration: assert.objectStrict as (value: unknown) => asserts value is VaultConfiguration,
})

/** The options for creating the key vault. */
export type CreateVaultOptions = Loose<ReturnType<typeof CREATE_VAULT_OPTIONS_SCHEMA>>

/**
 * Creates a new key vault for storing variables. The function will create a new `Vault` entity
 * with the given options and assign the user to the vault with full access. The function will
 * throw an error if the vault already exists in the workspace.
 *
 * @param options The options for creating the key vault
 * @returns The newly created `Vault` entity.
 */
export async function createVault(this: ModuleVault, options: CreateVaultOptions): Promise<Vault> {
  const { user, workspace, configuration, type = 'local', name = 'default' } = CREATE_VAULT_OPTIONS_SCHEMA(options)

  // --- Assert that no vault with the same name exists in the workspace.
  const { Vault } = this.getRepositories()
  const exists = await Vault.countBy({ name, workspace })
  if (exists > 0) throw this.errors.VAULT_ALREADY_EXISTS(workspace.name, name)

  // --- Encrypt the configuration using the module's encryption key.
  const configurationJson = JSON.stringify(configuration)
  const configurationEncrypted = await encrypt(
    configurationJson,
    this.encryptionSecret,
    this.encryptionAlgorithm,
  )

  // --- Create the vault and assign the user to it.
  const { VaultAssignment } = this.getRepositories()
  const assignment = VaultAssignment.create({ user, permission: 'Owner', createdBy: user })
  return Vault.create({
    createdBy: user,
    type,
    name,
    workspace,
    configuration: configurationEncrypted,
    assignments: [assignment],
  })
}
