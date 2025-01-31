import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'
import { checkPassword } from './checkPassword'
import { createPassword } from './createPassword'

describe.concurrent('checkPassword', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('matching', (it) => {
    it('should return true for a matching password', async({ moduleUser, createUser }) => {
      const { user, password } = await createUser()
      const result = await checkPassword.call(moduleUser, user, password)
      expect(result).toBe(true)
    })
  })

  describe<Context>('mismatching', (it) => {
    it('should return false for a non-matching password', async({ moduleUser, createUser }) => {
      const { user } = await createUser()
      const result = await checkPassword.call(moduleUser, user, 'wrong-password')
      expect(result).toBe(false)
    })

    it('should return false even if matching an old password', async({ moduleUser, createUser }) => {
      const { user, password: oldPassword } = await createUser()
      const newPassword = await createPassword.call(moduleUser, 'new-password')
      user.passwords!.push(newPassword)
      await moduleUser.getRepositories().User.save(user)
      const result = await checkPassword.call(moduleUser, user, oldPassword)
      expect(result).toBe(false)
    })

    it('should return false if the password has expired', async({ moduleUser, createUser }) => {
      const { user, password } = await createUser()
      user.passwords![0].expiredAt = new Date(Date.now() - 1000)
      await moduleUser.getRepositories().User.save(user)
      const result = await checkPassword.call(moduleUser, user, password)
      expect(result).toBe(false)
    })

    it('should return false if no password is stored for the user', async({ moduleUser, createUser }) => {
      const { user, password } = await createUser()
      user.passwords = []
      await moduleUser.getRepositories().User.save(user)
      const result = await checkPassword.call(moduleUser, user, password)
      expect(result).toBe(false)
    })
  })
}, 1000)
