import type { Loose } from '@unshared/types'
import type { ModuleVault } from '..'
import type { Vault } from '../entities'
import type { VaultConfiguration } from './getVaultAdapter'
import { assertObjectStrict, assertString, assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'
import { assertVaultType } from './assertVaultType'
import { encrypt } from './encrypt'

const CREATE_VAULT_OPTIONS_SCHEMA = createSchema({

  /** The user that created the key vault. */
  user: createSchema({ id: assertStringUuid }),

  /** The type of key vault. */
  type: assertVaultType,

  /** The name of the key vault. */
  name: assertStringNotEmpty,

  /** The description of the key vault. */
  description: [[assertUndefined], [assertString]],

  /** The workspace that the key vault belongs to. */
  workspace: createSchema({ id: assertStringUuid, name: assertStringNotEmpty }),

  /** The configuration for the key vault. */
  configuration: assertObjectStrict as (value: unknown) => VaultConfiguration,
})

/** The options for creating the key vault. */
export type CreateVaultOptions = Loose<ReturnType<typeof CREATE_VAULT_OPTIONS_SCHEMA>>

/**
 * Creates a new key vault for storing variables.
 *
 * @param options The options for creating the key vault
 * @returns The created key vault
 */
export async function createVault(this: ModuleVault, options: CreateVaultOptions): Promise<Vault> {
  const { Vault, VaultAssignment } = this.getRepositories()
  const { user, name, type, workspace, description, configuration } = CREATE_VAULT_OPTIONS_SCHEMA(options)

  // --- Assert that no vault with the same name exists in the workspace.
  const exists = await Vault.countBy({ name, workspace })
  if (exists > 0) throw this.errors.VAULT_ALREADY_EXISTS(name, workspace.name)

  // --- Encrypt the configuration using the module's encryption key.
  const configurationJson = JSON.stringify(configuration)
  const configurationEncrypted = await encrypt(
    configurationJson,
    this.vaultConfigurationSecretKey,
    this.vaultConfigurationAlgorithm,
  )

  // --- Create the key vault.
  const vault = Vault.create({
    createdBy: user,
    type,
    name,
    workspace,
    description,
    configuration: configurationEncrypted,
  })

  // --- Assign the user as the owner of the key vault.
  const assignment = VaultAssignment.create({ user, vault, permission: 'Owner', createdBy: user })
  vault.assignments = [assignment]

  // --- Save the vault to the database.
  await Vault.save(vault)
  return vault
}
