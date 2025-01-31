import { ThreadError } from '@nwrx/core'

export interface PisteCredentials {
  clientId: string
  clientSecret: string
}

export async function getAccessToken(credentials: PisteCredentials): Promise<string> {
  const url = new URL('https://oauth.piste.gouv.fr/api/oauth/token')
  const authResponse = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      scope: 'openaid',
    }),
  })

  if (!authResponse.ok) {
    const message = await authResponse.text()
    throw new ThreadError({
      name: 'PISTE_AUTH_ERROR',
      message: `Failed to authenticate with Piste API: ${message}`,
      data: { message },
    })
  }

  const authData = await authResponse.json() as { access_token: string }
  return authData.access_token
}
