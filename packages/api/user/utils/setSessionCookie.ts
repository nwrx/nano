import type { H3Event } from 'h3'
import type { UserSession } from '../entities'
import { setCookie } from 'h3'
import { createCipheriv, createHash } from 'node:crypto'

export interface SetSessionCookieOptions {

  /**
   * The name of the session cookie.
   */
  cookieName: string

  /**
   * The secret key to encrypt the session token.
   */
  secretKey: string

  /**
   * The algorithm to encrypt the session token with.
   */
  cypherAlgorithm: string
}

/**
 * Given an `H3Event` and a `UserSession`, set the session cookie in the response headers.
 *
 * @param event The H3 event object.
 * @param session
 * The session to create the cookie for. It will use the ID of the session and
 * cypher it with the secret key to create the session token. The session token
 * can then be used to authenticate the user and authorize the user to access
 * protected resources.
 * @param options The options to set the session cookie with.
 */
export function setSessionCookie(event: H3Event, session: UserSession, options: SetSessionCookieOptions): void {
  const { cookieName, secretKey, cypherAlgorithm } = options

  // --- Create the token for the session.
  const iv = Buffer.alloc(16, 0)
  const key = createHash('sha256').update(secretKey).digest()
  const token = createCipheriv(cypherAlgorithm, key, iv).update(session.id).toString('hex')

  // --- Set the session cookie in the response headers.
  setCookie(event, cookieName, token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: session.expiresAt,
    maxAge: (session.expiresAt.getTime() - Date.now()) / 1000,
  })
}
