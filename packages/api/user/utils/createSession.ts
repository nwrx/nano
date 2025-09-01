import type { H3Event } from 'h3'
import type { User } from '../entities'
import type { UserSession } from '../entities'
import type { ModuleUser } from '../index'
import { setCookie } from 'h3'
import { randomUUID } from 'node:crypto'
import { encrypt } from '../../utils'
import { getEventInformation } from './getEventInformation'

export interface CreateSessionOptions {

  /** The user to create the session for. */
  user: User

  /** The duration of the session in milliseconds. */
  duration?: number
}

/**
 * Create a new user session for the user. This is used to authenticate the user
 * and authorize the user to access the resources on the server. A session is
 * assigned to a single address and user agent and expires after a certain time.
 *
 * @param event The event that triggered the session creation.
 * @param options The options to create the session with.
 * @returns The user session.
 */
export async function createSession(this: ModuleUser, event: H3Event, options: CreateSessionOptions): Promise<UserSession> {
  const { user, duration = this.sessionDuration } = options

  // --- Throw an error if address or user agent is missing.
  const { address, userAgent } = getEventInformation.call(this, event)
  if (!address) throw this.errors.USER_ADDRESS_NOT_RESOLVED()
  if (!userAgent) throw this.errors.USER_MISSING_USER_AGENT_HEADER()

  // --- Compute all time-based values now to avoid any drift.
  const now = Date.now()
  const expiresAt = new Date(now + duration * 1000)
  const maxAge = (expiresAt.getTime() - now) / 1000

  // --- Create the session entity and encrypt the secret.
  const sessionId = randomUUID()
  const { cipher, ...secret } = await encrypt(
    sessionId,
    this.sessionEncryptionSecret,
    this.sessionEncryptionAlgorithm,
  )

  // --- Set the session ID in the response headers.
  setCookie(event, this.sessionIdCookieName, sessionId, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: expiresAt,
    maxAge,
  })

  // --- Set the session cookie in the response headers.
  setCookie(event, this.sessionTokenCookieName, cipher, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: expiresAt,
    maxAge,
  })

  const { UserSession } = this.getRepositories()
  return UserSession.create({
    id: sessionId,
    user,
    address,
    userAgent,
    expiresAt,
    secret,
  })
}
