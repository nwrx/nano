import type { User } from '../entities'
import type { UserSession } from '../entities'
import type { ModuleUser } from '../index'
import { createCipheriv, createHash } from 'node:crypto'

export interface CreateSessionOptions {

  /** The IP address to assign to the session. */
  address?: string

  /** The user agent to assign to the session. */
  userAgent?: string

  /** The duration of the session in milliseconds. */
  duration?: number
}

/**
 * Create a new user session for the user. This is used to authenticate the user
 * and authorize the user to access the resources on the server. A session is
 * assigned to a single address and user agent and expires after a certain time.
 *
 * @param user The user to create the session for.
 * @param options The options to create the session with.
 * @returns The user session.
 */
export function createSession(this: ModuleUser, user: User, options: CreateSessionOptions): { session: UserSession; token: string } {
  const { UserSession } = this.getRepositories()
  const { address, userAgent, duration = this.userSessionDuration } = options

  // --- Get the IP address and user agent.
  if (!address) throw this.errors.USER_MISSING_HEADER()
  if (!userAgent) throw this.errors.USER_MISSING_HEADER()

  // --- Create the session entity.
  const session = UserSession.create({
    user,
    address,
    userAgent,
    expiresAt: new Date(Date.now() + duration),
  })

  // --- Create the token for the session.
  const iv = Buffer.alloc(16, 0)
  const key = createHash('sha256').update(this.userSecretKey).digest()
  const token = createCipheriv(this.userCypherAlgorithm, key, iv).update(session.id).toString('hex')

  // --- Return the session and the token.
  return { session, token }
}
