/* eslint-disable sonarjs/no-hardcoded-passwords */
import { type Context, createTestContext } from '../../__fixtures__'
import { checkPassword } from './checkPassword'
import { createUser } from './createUser'

describe.concurrent('authenticate', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('createUser', (it) => {
    it('should create a user with valid options', async({ moduleUser }) => {
      const { user } = await createUser.call(moduleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
      expect(user).toMatchObject({ username: 'jdoe', email: 'jdoe@acme.com' })
    })

    it('should create the user profile with the same username', async({ moduleUser }) => {
      const { user } = await createUser.call(moduleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
      expect(user.profile).toMatchObject({ displayName: 'jdoe' })
    })

    it('should create a password if provided', async({ moduleUser }) => {
      const { user } = await createUser.call(moduleUser, { username: 'jdoe', email: 'jdoe@acme.com', password: 'password' })
      expect(user.passwords).toHaveLength(1)
    })

    it('should store the password hash and be able to check it', async({ moduleUser }) => {
      const { user } = await createUser.call(moduleUser, { username: 'jdoe', email: 'jdoe@acme.com', password: 'password' })
      await moduleUser.getRepositories().User.save(user)
      const result = await checkPassword.call(moduleUser, user, 'password')
      expect(result).toBe(true)
    })

    it('should not create a password if not provided', async({ moduleUser }) => {
      const { user } = await createUser.call(moduleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
      expect(user.passwords).toBeUndefined()
    })

    it('should create the user workspace with the same username', async({ moduleUser }) => {
      const { workspace } = await createUser.call(moduleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
      expect(workspace).toMatchObject({ name: 'jdoe', isPublic: true })
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if the username is already taken', async({ moduleUser }) => {
      const { user } = await createUser.call(moduleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
      await moduleUser.getRepositories().User.save(user)
      const shouldReject = createUser.call(moduleUser, { username: 'jdoe', email: 'not-jdoe@acme.com' })
      const error = moduleUser.errors.USER_EMAIL_OR_NAME_TAKEN()
      await expect(shouldReject).rejects.toEqual(error)
    })

    it('should throw an error if the email is already taken', async({ moduleUser }) => {
      const { user } = await createUser.call(moduleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
      await moduleUser.getRepositories().User.save(user)
      const shouldReject = createUser.call(moduleUser, { username: 'not-jdoe', email: 'jdoe@acme.com' })
      const error = moduleUser.errors.USER_EMAIL_OR_NAME_TAKEN()
      await expect(shouldReject).rejects.toEqual(error)
    })
  })
})
