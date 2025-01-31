import type { H3Event } from 'h3'
import type { User } from '../entities'
import type { UserSession } from '../entities'
import type { ModuleUser } from '../index'
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
export function createSession(this: ModuleUser, event: H3Event, options: CreateSessionOptions): UserSession {
  const { UserSession } = this.getRepositories()
  const { user, duration = this.userSessionDuration } = options

  // --- Get the IP address and user agent from the request.
  const { address, userAgent } = getEventInformation(event, {
    cookieName: this.userSessionCookieName,
    trustProxy: this.userTrustProxy,
  })

  // --- Throw an error if address or user agent is missing.
  if (!address) throw this.errors.USER_ADDRESS_NOT_RESOLVED()
  if (!userAgent) throw this.errors.USER_MISSING_USER_AGENT_HEADER()

  // --- Create the session entity.
  const expiresAt = new Date(Date.now() + duration)
  return UserSession.create({ user, address, userAgent, expiresAt })
}
