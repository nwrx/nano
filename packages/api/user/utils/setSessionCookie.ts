import type { H3Event } from 'h3'
import type { UserSession } from '../entities'
import type { ModuleUser } from '../index'
import { setCookie } from 'h3'
import { createCipheriv, createHash } from 'node:crypto'

/**
 * Given an `H3Event` and a `UserSession`, set the session cookie in the response headers.
 *
 * @param event The H3 event object.
 * @param session The user session to set the cookie for.
 */
export function setSessionCookie(this: ModuleUser, event: H3Event, session: UserSession): void {

  // --- Create the token for the session.
  const iv = Buffer.alloc(16, 0)
  const key = createHash('sha256').update(this.userSecretKey).digest()
  const token = createCipheriv(this.userCypherAlgorithm, key, iv).update(session.id).toString('hex')

  // --- Set the session cookie in the response headers.
  setCookie(event, this.userSessionCookieName, token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    path: '/api',
    expires: session.expiresAt,
    maxAge: (session.expiresAt.getTime() - Date.now()) / 1000,
  })
}
