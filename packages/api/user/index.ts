import type { CipherGCMTypes } from 'node:crypto'
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
  userCypherAlgorithm?: CipherGCMTypes

  /**
   * The cookie name used to store the id of the user session
   * and authenticate the user.
   *
   * @default '__Host-Session-Id'
   */
  userSessionIdCookieName?: string

  /**
   * The cookie name used to store the user session token
   * and authenticate the user.
   *
   * @default '__Host-Session-Token'
   */
  userSessionTokenCookieName?: string

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
    if (options.userSessionTokenCookieName) this.userSessionTokenCookieName = options.userSessionTokenCookieName
    if (options.userSessionDuration) this.userSessionDuration = options.userSessionDuration
    if (options.userRecoveryDuration) this.userRecoveryDuration = options.userRecoveryDuration
  }

  // --- Parameters.
  userTrustProxy = true
  userSecretKey = randomBytes(64).toString('hex')
  userCypherAlgorithm: CipherGCMTypes = 'aes-256-gcm'
  userSessionIdCookieName = '__Host-Session-Id'
  userSessionTokenCookieName = '__Host-Session-Token'
  userSessionDuration = 3600 * 24
  userRecoveryDuration = 600

  /**
   * Given a username, resolve the user entity. This is used to find the user
   *
   * @param options The options to resolve the user.
   * @returns The resolved user entity.
   * @example const user = await resolveUser({ username: 'alice', user })
   */
  getUser = UTILS.getUser.bind(this)

  /**
   * Authenticate the user by the token contained in the request's cookie payload
   * and return it's associated `User` entity. If the user is not authenticated, it
   * will throw an error. If the `optional` option is set to `true`, it will return
   * `undefined` instead of throwing an error.
   *
   * @param event The H3 event to authenticate the user from.
   * @returns The user associated with the user session.
   */
  authenticate = UTILS.authenticate.bind(this) as typeof UTILS.authenticate
}
