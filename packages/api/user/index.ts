import type { CipherGCMTypes } from 'node:crypto'
import { ModuleBase } from '@unserved/server'
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
  trustProxy: boolean

  /**
   * The secret key used to sign the tokens. This key should be kept secret and should
   * not be shared with anyone. By default, the key is read from the `process.env.USER_SESSION_SECRET`
   * environment variable. If the variable is not set, a random key is generated.
   *
   * @default randomBytes(64).toString('hex')
   */
  sessionEncryptionSecret: string

  /**
   * The algorithm used to encrypt the user session token
   * and authenticate the user. The algorithm should be
   * secure and should not be easily decrypted.
   *
   * @default 'aes-256-gcm'
   */
  sessionEncryptionAlgorithm: CipherGCMTypes

  /**
   * The time in milliseconds that the user session token
   * will expire. It should be a reasonable time for the
   * user to stay logged in but not too long to be a
   * security risk.
   *
   * @default 1000 * 60 * 60 * 24
   */
  sessionDuration: number

  /**
   * The cookie name used to store the id of the user session
   * and authenticate the user.
   *
   * @default '__Host-Session-Id'
   */
  sessionIdCookieName: string

  /**
   * The cookie name used to store the user session token
   * and authenticate the user.
   *
   * @default '__Host-Session-Token'
   */
  sessionTokenCookieName: string

  /**
   * Time in milliseconds that the user recovery token will expire. It should be a
   * reasonable time for the user to reset their password but not too long to be a
   * security risk.
   *
   * @default 1000 * 60 * 30 // 30 minutes
   */
  recoveryTokenDuration: number
}

export class ModuleUser extends ModuleBase implements ModuleUserOptions {
  errors = UTILS.ERRORS
  routes = ROUTES
  entities = ENTITIES
  dependencies = [ModuleStorage, ModuleWorkspace, ModuleProject, ModuleFlow]

  constructor(options: ModuleUserOptions) {
    super()
    this.trustProxy = options.trustProxy
    this.sessionEncryptionSecret = options.sessionEncryptionSecret
    this.sessionEncryptionAlgorithm = options.sessionEncryptionAlgorithm
    this.sessionDuration = options.sessionDuration
    this.sessionIdCookieName = options.sessionIdCookieName
    this.sessionTokenCookieName = options.sessionTokenCookieName
    this.recoveryTokenDuration = options.recoveryTokenDuration
  }

  // --- Parameters.
  trustProxy: boolean
  sessionEncryptionSecret: string
  sessionEncryptionAlgorithm: CipherGCMTypes
  sessionDuration: number
  sessionIdCookieName: string
  sessionTokenCookieName: string
  recoveryTokenDuration: number

  // --- Methods.
  getUser = UTILS.getUser.bind(this)
  authenticate = UTILS.authenticate.bind(this) as typeof UTILS.authenticate
}
