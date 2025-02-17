import { ModuleBase } from '@unserved/server'
import { ModuleProject } from '../project'
import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
// import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export type * from './utils'

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
   * The default key used to encrypt and decrypt local secrets. It will be used as
   * the default cypher key for all variables that use the `local` vault adapter
   * and don't have a specific key set.
   *
   * @default process.env.VAULT_DEFAULT_LOCAL_SECRET_KEY
   */
  vaultDefaultLocalSecretKey?: string
}

export class ModuleVault extends ModuleBase implements ModuleVaultOptions {
  // routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [ModuleUser, ModuleProject]
  vaultConfigurationSecretKey = process.env.VAULT_CONFIGURATION_SECRET_KEY
  vaultDefaultLocalSecretKey = process.env.VAULT_DEFAULT_LOCAL_SECRET

  constructor(options: ModuleVaultOptions) {
    super()
    if (options.vaultConfigurationSecretKey) this.vaultConfigurationSecretKey = options.vaultConfigurationSecretKey
    if (options.vaultDefaultLocalSecretKey) this.vaultDefaultLocalSecretKey = options.vaultDefaultLocalSecretKey
  }
}
