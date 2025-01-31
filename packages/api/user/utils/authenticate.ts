import type { H3Event } from 'h3'
import type { User, UserSession } from '../entities'
import type { ModuleUser } from '../index'
import { EXP_UUID } from '@unshared/validation'
import { getCookie, getHeader, getRequestIP } from 'h3'
import { createDecipheriv, createHash, type UUID } from 'node:crypto'

export interface AuthenticateOptions<U extends boolean = boolean> {

  /**
   * If `true`, it won't throw an error if the user session was not found or
   * was invalid. Instead, it will return `undefined`.
   */
  optional?: U
}

export type AuthenticateResult = { user: User } & UserSession

/**
 * Authenticate the user by the token contained in the request's cookie payload
 * and return it's associated `User` entity. If the user is not authenticated, it
 * will throw an error. If the `optional` option is set to `true`, it will return
 * `undefined` instead of throwing an error.
 *
 * @param event The H3 event to authenticate the user from.
 * @returns The user associated with the user session.
 */
export async function authenticate(this: ModuleUser, event: H3Event): Promise<AuthenticateResult>
export async function authenticate(this: ModuleUser, event: H3Event, options: AuthenticateOptions<false>): Promise<AuthenticateResult>
export async function authenticate(this: ModuleUser, event: H3Event, options: AuthenticateOptions<true>): Promise<AuthenticateResult | undefined>
export async function authenticate(this: ModuleUser, event: H3Event, options: AuthenticateOptions = {}): Promise<AuthenticateResult | undefined> {
  const { optional = false } = options

  // --- Extract and decrypt the token from the cookie.
  const token = getCookie(event, this.userSessionCookieName)
  if (!token && optional) return
  if (!token) throw this.errors.USER_NOT_AUTHENTICATED()

  // --- Decrypt the token to get the user session id.
  const iv = Buffer.alloc(16, 0)
  const key = createHash('sha256').update(this.userSecretKey).digest()
  const id = createDecipheriv(this.userCypherAlgorithm, key, iv).update(token, 'hex', 'utf8').toString()
  const isUuid = EXP_UUID.test(id)
  if (!isUuid) throw this.errors.USER_SESSION_NOT_FOUND()

  // --- Find the user session by the token.
  const { UserSession } = this.getRepositories()
  const userSession = await UserSession.findOne({
    where: { id: id as UUID },
    relations: { user: true },
    withDeleted: true,
  })

  // --- Get the IP address and user agent.
  const requestIp = getRequestIP(event, { xForwardedFor: this.userTrustProxy })
  const userAgent = getHeader(event, 'User-Agent')
  const address = requestIp?.split(':')[0]

  // --- Assert the session exists and the user is not soft deleted.
  const now = new Date()
  if (!userSession) throw this.errors.USER_SESSION_NOT_FOUND()
  if (!userSession.user) throw this.errors.USER_SESSION_NOT_FOUND()
  if (userSession.user.deletedAt) throw this.errors.USER_SESSION_NOT_FOUND()
  if (userSession.user.disabledAt) throw this.errors.USER_SESSION_NOT_FOUND()
  if (userSession.address !== address) throw this.errors.USER_SESSION_NOT_FOUND()
  if (userSession.userAgent !== userAgent) throw this.errors.USER_SESSION_NOT_FOUND()
  if (userSession.expiresAt < now) throw this.errors.USER_SESSION_EXPIRED()

  // --- Return the user associated with the session.
  return userSession as AuthenticateResult
}
