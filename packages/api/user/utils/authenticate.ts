/* eslint-disable jsdoc/require-param */
import type { Peer } from 'crossws'
import type { H3Event } from 'h3'
import type { UUID } from 'node:crypto'
import type { User, UserSession } from '../entities'
import type { ModuleUser } from '../index'
import { decrypt } from '../../utils'
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
export async function authenticate(this: ModuleUser, event: H3Event | Peer, options: AuthenticateOptions<true>): Promise<Partial<AuthenticateResult>>
export async function authenticate(this: ModuleUser, event: H3Event | Peer, options?: AuthenticateOptions): Promise<Partial<AuthenticateResult>>
export async function authenticate(this: ModuleUser, event: H3Event | Peer, options: AuthenticateOptions = {}): Promise<Partial<AuthenticateResult>> {
  const { optional = false } = options
  const { sessionId, sessionToken, address, userAgent } = getEventInformation.call(this, event)

  // --- Extract and decrypt the token from the cookie.
  try {
    if (!sessionId) throw this.errors.USER_UNAUTHORIZED()
    if (!sessionToken) throw this.errors.USER_UNAUTHORIZED()
    if (!address) throw this.errors.USER_ADDRESS_NOT_RESOLVED()
    if (!userAgent) throw this.errors.USER_MISSING_USER_AGENT_HEADER()
  }
  catch (error) {
    if (optional) return {}
    throw error
  }

  // --- Find the user session by the token.
  const { UserSession } = this.getRepositories()
  const userSession = await UserSession.findOne({
    where: { id: sessionId as UUID },
    relations: { user: true },
    withDeleted: true,
  })

  // --- Decrypt the token to get the user session id.
  if (!userSession) throw this.errors.USER_SESSION_NOT_FOUND()
  let decipher: string | undefined
  try { decipher = await decrypt({ cipher: sessionToken, ...userSession.secret }, this.sessionEncryptionSecret) }
  catch { throw this.errors.USER_SESSION_NOT_FOUND() }
  if (decipher !== userSession.id) throw this.errors.USER_SESSION_NOT_FOUND()

  // --- Assert the session exists and the user is not soft deleted.
  const now = new Date()
  if (!userSession.user) throw this.errors.USER_INTERNAL_ERROR('The **user** relationship is not loaded')
  if (userSession.deletedAt) throw this.errors.USER_SESSION_NOT_FOUND()
  if (userSession.user.deletedAt) throw this.errors.USER_NOT_FOUND(userSession.user.id)
  if (userSession.user.disabledAt) throw this.errors.USER_DISABLED()
  if (userSession.address !== address) throw this.errors.USER_SESSION_ADDRESS_MISMATCH()
  if (userSession.userAgent !== userAgent) throw this.errors.USER_SESSION_USER_AGENT_MISMATCH()
  if (userSession.expiresAt < now) throw this.errors.USER_SESSION_EXPIRED()

  // --- Return the user associated with the session.
  userSession.lastUsedAt = now
  await UserSession.save(userSession)
  return userSession as AuthenticateResult
}
