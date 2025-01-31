import type { Context } from '../../__fixtures__'
import { createContext } from '../../__fixtures__'
import { createUser } from './createUser'

describe.concurrent<Context>('createUser', (it) => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  it('should create a user with valid options', async({ expect, ctx }) => {
    const { user } = await createUser.call(ctx.ModuleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
    expect(user).toMatchObject({ username: 'jdoe', email: 'jdoe@acme.com' })
  })

  it('should create the user profile with the same username', async({ expect, ctx }) => {
    const { user } = await createUser.call(ctx.ModuleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
    expect(user.profile).toMatchObject({ displayName: 'jdoe' })
  })

  it('should not create a password if not provided', async({ expect, ctx }) => {
    const { user } = await createUser.call(ctx.ModuleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
    expect(user.passwords).toBeUndefined()
  })

  it('should create the user workspace with the same username', async({ expect, ctx }) => {
    const { workspace } = await createUser.call(ctx.ModuleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
    expect(workspace).toMatchObject({ name: 'jdoe', isPublic: true })
  })

  it('should throw an error if the username is already taken', async({ expect, ctx }) => {
    await ctx.createUser('jdoe')
    const shouldReject = createUser.call(ctx.ModuleUser, { username: 'jdoe', email: 'not-jdoe@acme.com' })
    const error = ctx.ModuleUser.errors.USER_EMAIL_OR_NAME_TAKEN()
    await expect(shouldReject).rejects.toEqual(error)
  })

  it('should throw an error if the email is already taken', async({ expect, ctx }) => {
    await ctx.createUser('jdoe', { email: 'jdoe@acme.com' })
    const shouldReject = createUser.call(ctx.ModuleUser, { username: 'not-jdoe', email: 'jdoe@acme.com' })
    const error = ctx.ModuleUser.errors.USER_EMAIL_OR_NAME_TAKEN()
    await expect(shouldReject).rejects.toEqual(error)
  })
})
