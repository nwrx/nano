import type { User } from '../entities'
import type { UserSession } from '../entities'
import type { ModuleUser } from '../index'
import { getHeader, getRequestIP, type H3Event } from 'h3'
import { createCipheriv, createHash } from 'node:crypto'

export interface CreateSessionOptions {

  /** The user to create the session for. */
  user: User

  /** The duration of the session in milliseconds. */
  duration?: number
}

export interface CreateSessionResult {

  /** The created user session. */
  session: UserSession

  /** The token for the session. */
  token: string
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
export function createSession(this: ModuleUser, event: H3Event, options: CreateSessionOptions): CreateSessionResult {
  const { UserSession } = this.getRepositories()
  const { user, duration = this.userSessionDuration } = options

  // --- Get the IP address and user agent.
  const address = getRequestIP(event, { xForwardedFor: this.userTrustProxy })
  const userAgent = getHeader(event, 'User-Agent')
  const expiresAt = new Date(Date.now() + duration)

  // --- Create the session entity.
  const session = UserSession.create({ user, address, userAgent, expiresAt })

  // --- Create the token for the session.
  const iv = Buffer.alloc(16, 0)
  const key = createHash('sha256').update(this.userSecretKey).digest()
  const token = createCipheriv(this.userCypherAlgorithm, key, iv).update(session.id).toString('hex')

  // --- Return the session and the token.
  return { session, token }
}
