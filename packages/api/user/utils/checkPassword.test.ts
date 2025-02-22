/* eslint-disable sonarjs/no-hardcoded-passwords */
import type { Context } from '../../__fixtures__'
import { createTestContext, FIXTURE_USER_BASIC } from '../../__fixtures__'
import { checkPassword } from './checkPassword'
import { createPassword } from './createPassword'
import { createUser } from './createUser'

const PASSWORD = 'password'

describe.concurrent('checkPassword', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('matching', (it) => {
    it('should return true for a matching password', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const password = await createPassword.call(moduleUser, { user, password: PASSWORD })
      await moduleUser.getRepositories().User.save(user)
      await moduleUser.getRepositories().UserPassword.save(password)
      const result = await checkPassword.call(moduleUser, user, PASSWORD)
      expect(result).toBe(true)
    })
  })

  describe<Context>('mismatching', (it) => {
    it('should return false for a non-matching password', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const password = await createPassword.call(moduleUser, { user, password: PASSWORD })
      await moduleUser.getRepositories().User.save(user)
      await moduleUser.getRepositories().UserPassword.save(password)
      const result = await checkPassword.call(moduleUser, user, 'not-the-password')
      expect(result).toBe(false)
    })

    it('should return false even if matching an old password', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const passwordOld = await createPassword.call(moduleUser, { user, password: PASSWORD })
      const passwordNew = await createPassword.call(moduleUser, { user, password: 'new-password' })
      await moduleUser.getRepositories().User.save(user)
      await moduleUser.getRepositories().UserPassword.save(passwordOld)
      await moduleUser.getRepositories().UserPassword.save(passwordNew)
      const result = await checkPassword.call(moduleUser, user, PASSWORD)
      expect(result).toBe(false)
    })

    it('should return false if the password has expired', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const password = await createPassword.call(moduleUser, { user, password: PASSWORD })
      password.expiredAt = new Date(Date.now() - 1000)
      await moduleUser.getRepositories().User.save(user)
      await moduleUser.getRepositories().UserPassword.save(password)
      const result = await checkPassword.call(moduleUser, user, PASSWORD)
      expect(result).toBe(false)
    })

    it('should return false if no password is stored for the user', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      await moduleUser.getRepositories().User.save(user)
      const result = await checkPassword.call(moduleUser, user, PASSWORD)
      expect(result).toBe(false)
    })
  })
})
