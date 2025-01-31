import type { CipherGCMTypes } from 'node:crypto'
import { ModuleBase } from '@unserved/server'
import { ModuleFlow } from '../flow'
import { ModuleUser } from '../user'
import { ModuleWorkspace } from '../workspace'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export * from './utils/assertProjectPermission'

export interface ModuleProjectOptions {

  /**
   * The secret key used to encrypt the secret variables in the flows. This key
   * is defined in the environment variables and should be kept secret. If the
   * key is changed, the existing secrets wont be accessible and any references
   * to the secrets may break.
   *
   * @default 'CHANGE_ME'
   */
  projectSecretKey?: string

  /**
   * The cypher algorithm used to encrypt the secret variables in the flows. The
   * algorithm is used to encrypt and decrypt the secrets using the secret key.
   *
   * @default 'aes-256-gcm'
   */
  projectSecretCypherAlgorithm?: CipherGCMTypes
}

/**
 * The `ModuleWorkspace` module is used to manage the workflows and modules in the
 * application. The module is used to create, import, edit, and delete workflows and
 * modules in the application.
 */
export class ModuleProject extends ModuleBase implements ModuleProjectOptions {
  errors = UTILS.ERRORS
  routes = ROUTES
  entities = ENTITIES
  dependencies = [ModuleUser, ModuleWorkspace, ModuleFlow]
  projectSecretKey = 'CHANGE_ME'
  projectSecretCypherAlgorithm: CipherGCMTypes = 'aes-256-gcm'
  constructor(options: ModuleProjectOptions = {}) {
    super()
    if (options.projectSecretKey) this.projectSecretKey = options.projectSecretKey
    if (options.projectSecretCypherAlgorithm) this.projectSecretCypherAlgorithm = options.projectSecretCypherAlgorithm
  }
}
