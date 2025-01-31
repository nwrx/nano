import type { Context } from '../../__fixtures__'
import { createContext } from '../../__fixtures__'
import { checkPassword } from './checkPassword'
import { createPassword } from './createPassword'

describe.concurrent<Context>('checkPassword', (it) => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
    await context.ctx.createServer()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  it('should return true for a matching password', async({ expect, ctx }) => {
    const { User } = ctx.ModuleUser.getRepositories()
    const user = User.create({ username: 'jdoe', email: 'john.doe@acme.com' })
    user.passwords = [await createPassword.call(ctx.ModuleUser, 'password')]
    await User.save(user)
    const result = await checkPassword.call(ctx.ModuleUser, user, 'password')
    expect(result).toBe(true)
  })

  it('should return false for a non-matching password', async({ expect, ctx }) => {
    const { User } = ctx.ModuleUser.getRepositories()
    const user = User.create({ username: 'jdoe', email: 'john.doe@acme.com' })
    user.passwords = [await createPassword.call(ctx.ModuleUser, 'password')]
    await User.save(user)
    const result = await checkPassword.call(ctx.ModuleUser, user, 'wrongpassword')
    expect(result).toBe(false)
  })

  it('should return false even if matching an old password', async({ expect, ctx }) => {
    const { User } = ctx.ModuleUser.getRepositories()
    const user = User.create({ username: 'jdoe', email: 'john.doe@acme.com' })
    user.passwords = [
      await createPassword.call(ctx.ModuleUser, 'old-password'),
      await createPassword.call(ctx.ModuleUser, 'password'),
    ]
    await User.save(user)
    const result = await checkPassword.call(ctx.ModuleUser, user, 'old-password')
    expect(result).toBe(false)
  })

  it('should return false if the password has expired', async({ expect, ctx }) => {
    const { User } = ctx.ModuleUser.getRepositories()
    const user = User.create({ username: 'jdoe', email: 'john.doe@acme.com' })
    user.passwords = [await createPassword.call(ctx.ModuleUser, 'password')]
    user.passwords[0].expiredAt = new Date(Date.now() - 1000)
    await User.save(user)
    const result = await checkPassword.call(ctx.ModuleUser, user, 'password')
    expect(result).toBe(false)
  })

  it('should return false if no password is stored for the user', async({ expect, ctx }) => {
    const { User } = ctx.ModuleUser.getRepositories()
    const user = User.create({ username: 'jdoe', email: 'john.doe@acme.com' })
    await User.save(user)
    const result = await checkPassword.call(ctx.ModuleUser, user, 'password')
    expect(result).toBe(false)
  })
})
