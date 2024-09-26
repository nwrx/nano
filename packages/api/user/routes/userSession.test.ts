import type { Context } from '../../__fixtures__'
import { createContext } from '../../__fixtures__'

describe.concurrent<Context>('request HEAD /api/session', (it) => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  it('should return the username of the authenticated user', async({ expect, ctx }) => {
    const { user, headers } = await ctx.createUser()
    const response = await ctx.fetch('/api/session', { method: 'GET', headers })
    const body = await response.json() as Record<string, string>
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/json')
    expect(body).toStrictEqual({ username: user.username })
  })

  it('should return null if the user is not authenticated', async({ expect, ctx }) => {
    const response = await ctx.fetch('/api/session', { method: 'GET' })
    const body = await response.json() as Record<string, string>
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/json')
    expect(body).toStrictEqual({})
  })

  it('should return an error if the session token is invalid', async({ expect, ctx }) => {
    const headers = { Cookie: `${ctx.ModuleUser.userSessionCookieName}=000000` }
    const response = await ctx.fetch('/api/session', { method: 'GET', headers })
    const body = await response.json() as Record<string, string>
    expect(response.status).toBe(401)
    expect(response.headers.get('Content-Type')).toBe('application/json')
    expect(body).toMatchObject({ data: { name: 'E_USER_SESSION_NOT_FOUND' } })
  })
})
