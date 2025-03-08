import type { CipherGCMTypes } from 'node:crypto'
import { ModuleBase } from '@unserved/server'
import { ModuleProject } from '../project'
import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export type * from './adapters'
export * from './entities'
export * from './utils/assertVaultPermission'
export * from './utils/assertVaultType'
export type * from './utils/getVaultProjectPermissions'
export type * from './utils/getVaultUserPermissions'

export interface ModuleVaultOptions {

  /**
   * The master secret used to encrypt and decrypt the configuration of aditional
   * vault adapters. This allows secure storage of the vault configuration in the
   * database without exposing the credentials.
   *
   * @default process.env.VAULT_CONFIGURATION_SECRET_KEY
   */
  vaultConfigurationSecretKey?: string

  /**
   * The algorithm used to encrypt and decrypt the configuration of additional vault
   * adapters. It must be one of the following values: `aes-256-gcm`, `aes-128-gcm`,
   * or `aes-192-gcm` to ensure we use authenticated encryption and verify the integrity
   * of the encrypted data.
   *
   * @default 'aes-256-gcm'
   */
  vaultConfigurationAlgorithm?: CipherGCMTypes

  /**
   * The default key used to encrypt and decrypt local secrets. It will be used as
   * the default cypher key for all variables that use the `local` vault adapter
   * and don't have a specific key set.
   *
   * @default process.env.VAULT_DEFAULT_LOCAL_SECRET_KEY
   */
  vaultDefaultLocalSecretKey?: string
}

export class ModuleVault extends ModuleBase implements ModuleVaultOptions {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [ModuleUser, ModuleProject]
  vaultConfigurationSecretKey = process.env.VAULT_CONFIGURATION_SECRET_KEY ?? ''
  vaultConfigurationAlgorithm = process.env.VAULT_CONFIGURATION_ALGORITHM as CipherGCMTypes ?? 'aes-256-gcm'
  vaultDefaultLocalSecretKey = process.env.VAULT_DEFAULT_LOCAL_SECRET ?? ''

  constructor(options: ModuleVaultOptions = {}) {
    super()
    if (options.vaultConfigurationSecretKey) this.vaultConfigurationSecretKey = options.vaultConfigurationSecretKey
    if (options.vaultConfigurationAlgorithm) this.vaultConfigurationAlgorithm = options.vaultConfigurationAlgorithm
    if (options.vaultDefaultLocalSecretKey) this.vaultDefaultLocalSecretKey = options.vaultDefaultLocalSecretKey
  }

  createVault = UTILS.createVault.bind(this)
}
