/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { createTestEvent } from '@unserved/server'
import { createTestContext } from '../../__fixtures__'
import { setSessionCookie } from './setSessionCookie'

describe.concurrent<Context>('authenticate', (it) => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
    vi.useFakeTimers({ now: new Date('2020-01-01T00:00:00Z'), toFake: ['Date'] })
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
    vi.useRealTimers()
  })

  it('should set the session token in the response cookie', async({ createUser }) => {
    const { session } = await createUser()
    const event = createTestEvent()
    setSessionCookie(event, session, {
      cookieName: '__Host-Session-Token',
      secretKey: 'secret',
      cypherAlgorithm: 'aes-256-gcm',
    })
    const [tokenCookie] = event.node.res.getHeader('set-cookie') as string[]
    const tokenCookieEntries = tokenCookie.split(';').map(x => x.trim().split('=')) as Array<[string, string]>
    const tokenCookieObject = Object.fromEntries(tokenCookieEntries)
    expect(tokenCookieObject).toStrictEqual({
      '__Host-Session-Token': expect.stringMatching(/^[\da-f]{72}$/),
      'Expires': 'Wed, 01 Jan 2020 01:00:00 GMT',
      'HttpOnly': undefined,
      'Max-Age': '3600',
      'Path': '/',
      'SameSite': 'Strict',
      'Secure': undefined,
    })
  })
})
