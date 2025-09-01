import type { CipherGCMTypes } from 'node:crypto'
import { ModuleBase } from '@unserved/server'
import { ModuleProject } from '../project'
import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export type * from './adapters'
export * from './entities'
export * from './utils/assertVault'
export * from './utils/assertVaultPermission'
export * from './utils/assertVaultType'
export * from './utils/assertVaultVariable'
export type * from './utils/getVaultProjectPermissions'
export type * from './utils/getVaultUserPermissions'

export interface ModuleVaultOptions {

  /**
   * The master secret used to encrypt and decrypt the configuration of aditional
   * vault adapters. This allows secure storage of the vault configuration in the
   * database without exposing the credentials.
   */
  encryptionSecret: string

  /**
   * The algorithm used to encrypt and decrypt the configuration of additional vault
   * adapters. It must be one of the following values: `aes-256-gcm`, `aes-128-gcm`,
   * or `aes-192-gcm` to ensure we use authenticated encryption and verify the integrity
   * of the encrypted data.
   *
   * @default 'aes-256-gcm'
   */
  encryptionAlgorithm: CipherGCMTypes
}

export class ModuleVault extends ModuleBase implements ModuleVaultOptions {
  routes = ROUTES
  entities = ENTITIES
  errors = UTILS.ERRORS
  dependencies = [ModuleUser, ModuleProject]
  encryptionSecret: string
  encryptionAlgorithm: CipherGCMTypes

  constructor(options: ModuleVaultOptions) {
    super()
    this.encryptionSecret = options.encryptionSecret
    this.encryptionAlgorithm = options.encryptionAlgorithm
  }

  createVault = UTILS.createVault.bind(this)
  getVault = UTILS.getVault.bind(this)
  getVariable = UTILS.getVariable.bind(this)
  getVariableValue = UTILS.getVariableValue.bind(this)
  searchVariableByProject = UTILS.searchVariableByProject.bind(this)
}
