import type { Context } from '../../__fixtures__'
import { createContext } from '../../__fixtures__'

describe.concurrent<Context>('userSignout', (it) => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  it('should respond with code 204', async({ ctx, expect }) => {
    const { headers } = await ctx.createUser('jdoe')
    const response = await ctx.fetch('/api/session', { method: 'DELETE', headers })
    expect(response.status).toBe(204)
    expect(response.statusText).toBe('No Content')
  })

  it('should remove the session cookie', async({ ctx, expect }) => {
    const { headers } = await ctx.createUser('jdoe')
    const response = await ctx.fetch('/api/session', { method: 'DELETE', headers })
    expect(response.headers.get('Set-Cookie')).toBe('__Secure_Session_Token=; Max-Age=0; Path=/')
  })

  it('should not respond with any content', async({ ctx, expect }) => {
    const { headers } = await ctx.createUser('jdoe')
    const response = await ctx.fetch('/api/session', { method: 'DELETE', headers })
    const body = await response.text()
    expect(body).toBe('')
  })

  it('should remove the session from the database', async({ ctx, expect }) => {
    const { user, headers } = await ctx.createUser('jdoe')
    const { UserSession } = ctx.ModuleUser.getRepositories()
    const sessionsBefore = await UserSession.find({ where: { user } })
    expect(sessionsBefore).toHaveLength(1)
    const response = await ctx.fetch('/api/session', { method: 'DELETE', headers })
    expect(response.status).toBe(204)
    const sessions = await UserSession.find({ where: { user } })
    expect(sessions).toHaveLength(0)
  })

  it('should not remove other sessions from the database', async({ ctx, expect }) => {
    const { user, headers } = await ctx.createUser('jdoe')
    const { UserSession } = ctx.ModuleUser.getRepositories()
    const otherSession = UserSession.create({ user, userAgent: 'test', address: '1.1.1.1', expiresAt: new Date() })
    await UserSession.save(otherSession)
    const response = await ctx.fetch('/api/session', { method: 'DELETE', headers })
    expect(response.status).toBe(204)
    const sessions = await UserSession.find({ where: { user } })
    expect(sessions).toHaveLength(1)
    expect(sessions).toMatchObject([{ id: otherSession.id }])
  })

  it('should respond with an error for unauthenticated user', async({ expect, ctx }) => {
    const response = await ctx.fetch('/api/session', { method: 'DELETE' })
    expect(response.status).toBe(401)
    const body = await response.json() as Record<string, string>
    expect(body).toMatchObject({ data: { name: 'E_USER_NOT_AUTHENTICATED' } })
  })
})
