import type { H3Event } from 'h3'
import type { User } from '../entities'
import type { UserSession } from '../entities'
import type { ModuleUser } from '../index'

export interface CreateSessionOptions {

  /** The user to create the session for. */
  user?: User

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
export function createSession(this: ModuleUser, event: H3Event, options: CreateSessionOptions = {}): UserSession {
  const { UserSession } = this.getRepositories()
  const { user, duration = this.userSessionDuration } = options

  // --- Get the IP address and user agent.
  const { address, userAgent } = this.getEventInformation(event)
  const expiresAt = new Date(Date.now() + duration)

  // --- Create the session entity.
  return UserSession.create({ user, address, userAgent, expiresAt })
}
