import { ModuleBase } from '@unserved/server'
import { randomBytes } from 'node:crypto'
import { ModuleFlow } from '../flow'
import { ModuleProject } from '../project'
import { ModuleStorage } from '../storage'
import { ModuleWorkspace } from '../workspace'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export * from './utils/assertUser'

export interface ModuleUserOptions {

  /**
   * Use the `X-Forwarded-For` HTTP header set by proxies. If `true`, it assumes the
   * server is behind a proxy and the client IP address is set in the `X-Forwarded-For`
   * header. This makes the authentication logic use the IP address from the header
   * instead of the source IP address of the request.
   *
   * @default true
   */
  userTrustProxy?: boolean

  /**
   * The secret key used to sign the tokens. This key should be kept secret and should
   * not be shared with anyone. By default, the key is read from the `process.env.USER_SESSION_SECRET`
   * environment variable. If the variable is not set, a random key is generated.
   *
   * @default randomBytes(64).toString('hex')
   */
  userSecretKey?: string

  /**
   * The algorithm used to encrypt the user session token
   * and authenticate the user. The algorithm should be
   * secure and should not be easily decrypted.
   *
   * @default 'aes-256-gcm'
   */
  userCypherAlgorithm?: string

  /**
   * The cookie name used to store the user session token
   * and authenticate the user. It can be any name but it
   * should be unique.
   *
   * @default '__Host-Session-Token'
   */
  userSessionCookieName?: string

  /**
   * The time in milliseconds that the user session token
   * will expire. It should be a reasonable time for the
   * user to stay logged in but not too long to be a
   * security risk.
   *
   * @default 1000 * 60 * 60 * 24
   */
  userSessionDuration?: number

  /**
   * Time in milliseconds that the user recovery token will expire. It should be a
   * reasonable time for the user to reset their password but not too long to be a
   * security risk.
   *
   * @default 1000 * 60 * 30 // 30 minutes
   */
  userRecoveryDuration?: number
}

/**
 * The `ModuleUser` class is used to group all the entities and services related to the user
 * together. It provides H3 routes to perform operations such as sign-in, sign-up, sign-out
 * as well as other user operations.
 */
export class ModuleUser extends ModuleBase implements ModuleUserOptions {
  errors = UTILS.ERRORS
  routes = ROUTES
  entities = ENTITIES
  dependencies = [
    ModuleStorage,
    ModuleWorkspace,
    ModuleProject,
    ModuleFlow,
  ]

  constructor(options: ModuleUserOptions = {}) {
    super()
    if (options.userTrustProxy) this.userTrustProxy = options.userTrustProxy
    if (options.userSecretKey) this.userSecretKey = options.userSecretKey
    if (options.userCypherAlgorithm) this.userCypherAlgorithm = options.userCypherAlgorithm
    if (options.userSessionCookieName) this.userSessionCookieName = options.userSessionCookieName
    if (options.userSessionDuration) this.userSessionDuration = options.userSessionDuration
    if (options.userRecoveryDuration) this.userRecoveryDuration = options.userRecoveryDuration
  }

  // --- Parameters.
  userTrustProxy = true
  userSecretKey = randomBytes(64).toString('hex')
  userCypherAlgorithm = 'aes-256-gcm'
  userSessionCookieName = '__Host-Session-Token'
  userSessionDuration = 1000 * 60 * 60 * 24
  userRecoveryDuration = 1000 * 60 * 30

  // --- Methods.
  getUser = UTILS.getUser.bind(this)
  authenticate = UTILS.authenticate.bind(this) as typeof UTILS.authenticate
}
