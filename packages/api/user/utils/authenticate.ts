import type { Peer } from 'crossws'
import type { H3Event } from 'h3'
import type { User, UserSession } from '../entities'
import type { ModuleUser } from '../index'
import { EXP_UUID } from '@unshared/validation'
import { createDecipheriv, createHash, type UUID } from 'node:crypto'
import { getEventInformation } from './getEventInformation'

export interface AuthenticateOptions<U extends boolean = boolean> {

  /**
   * If `true`, it won't throw an error if the user session was not found or
   * was invalid. Instead, it will return `undefined`.
   */
  optional?: U
}

export type AuthenticateResult = UserSession & { user: User }

/**
 * Authenticate the user by the token contained in the request's cookie payload
 * and return it's associated `User` entity. If the user is not authenticated, it
 * will throw an error. If the `optional` option is set to `true`, it will return
 * `undefined` instead of throwing an error.
 *
 * @param event The H3 event to authenticate the user from.
 * @returns The user associated with the user session.
 */
export async function authenticate(this: ModuleUser, event: H3Event | Peer): Promise<AuthenticateResult>
export async function authenticate(this: ModuleUser, event: H3Event | Peer, options: AuthenticateOptions<true>): Promise<AuthenticateResult | undefined>
export async function authenticate(this: ModuleUser, event: H3Event | Peer, options?: AuthenticateOptions): Promise<AuthenticateResult | undefined>
export async function authenticate(this: ModuleUser, event: H3Event | Peer, options: AuthenticateOptions = {}): Promise<AuthenticateResult | undefined> {
  const { optional = false } = options
  const { token, address, userAgent } = getEventInformation(event, {
    cookieName: this.userSessionCookieName,
    trustProxy: this.userTrustProxy,
  })

  // --- Extract and decrypt the token from the cookie.
  try {
    if (!token) throw this.errors.USER_NOT_AUTHENTICATED()
    if (!address) throw this.errors.USER_ADDRESS_NOT_RESOLVED()
    if (!userAgent) throw this.errors.USER_MISSING_USER_AGENT_HEADER()
  }
  catch (error) {
    if (optional) return undefined
    throw error
  }

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

  // --- Assert the session exists and the user is not soft deleted.
  const now = new Date()
  if (!userSession) throw this.errors.USER_SESSION_NOT_FOUND()
  if (userSession.deletedAt) throw this.errors.USER_SESSION_NOT_FOUND()
  if (!userSession.user) throw this.errors.USER_SESSION_NOT_FOUND()
  if (userSession.user.deletedAt) throw this.errors.USER_SESSION_NOT_FOUND()
  if (userSession.user.disabledAt) throw this.errors.USER_SESSION_NOT_FOUND()
  if (userSession.address !== address) throw this.errors.USER_SESSION_NOT_FOUND()
  if (userSession.userAgent !== userAgent) throw this.errors.USER_SESSION_NOT_FOUND()
  if (userSession.expiresAt < now) throw this.errors.USER_SESSION_EXPIRED()

  // --- Return the user associated with the session.
  userSession.lastUsedAt = now
  await UserSession.save(userSession)
  return userSession as AuthenticateResult
}
