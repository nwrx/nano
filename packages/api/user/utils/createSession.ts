import type { H3Event } from 'h3'
import type { User } from '../entities'
import type { UserSession } from '../entities'
import type { ModuleUser } from '../index'
import { setCookie } from 'h3'
import { randomBytes, randomUUID } from 'node:crypto'
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
  const { user, duration = this.userSessionDuration } = options

  // --- Get the IP address and user agent from the request.
  const { address, userAgent } = getEventInformation(event, {
    cookieName: this.userSessionTokenCookieName,
    trustProxy: this.userTrustProxy,
  })

  // --- Throw an error if address or user agent is missing.
  if (!address) throw this.errors.USER_ADDRESS_NOT_RESOLVED()
  if (!userAgent) throw this.errors.USER_MISSING_USER_AGENT_HEADER()

  // --- Create the session entity and encrypt the secret.
  const expiresAt = new Date(Date.now() + duration * 1000)
  const sessionId = randomUUID()
  const sessionSecret = randomBytes(32).toString('hex')
  const { cipher, ...secret } = await encrypt(
    sessionSecret,
    this.userSecretKey,
    this.userCypherAlgorithm,
  )

  // --- Set the session ID in the response headers.
  setCookie(event, this.userSessionIdCookieName, sessionId, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: expiresAt,
    maxAge: (expiresAt.getTime() - Date.now()) / 1000,
  })

  // --- Set the session cookie in the response headers.
  setCookie(event, this.userSessionTokenCookieName, cipher, {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: expiresAt,
    maxAge: (expiresAt.getTime() - Date.now()) / 1000,
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
