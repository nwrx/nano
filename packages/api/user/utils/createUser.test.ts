/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EXP_UUID } from '@unshared/validation'
import { type Context, createTestContext, FIXTURE_USER_BASIC } from '../../__fixtures__'
import { createUser } from './createUser'

describe.concurrent('authenticate', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('result', (it) => {
    it('should create a user with valid options', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      expect({ ...user }).toStrictEqual({
        id: expect.stringMatching(EXP_UUID),
        isSuperAdministrator: undefined,
        username: FIXTURE_USER_BASIC.username,
        email: FIXTURE_USER_BASIC.email,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: undefined,
        disabledAt: undefined,
        verifiedAt: undefined,
        profile: expect.any(Object),
      })
    })

    it('should create the user profile with the same username', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      expect({ ...user.profile }).toStrictEqual({
        id: expect.stringMatching(EXP_UUID),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: undefined,
        displayName: FIXTURE_USER_BASIC.username,
        biography: '',
        company: '',
        socials: [],
        website: '',
        user: undefined,
        avatar: undefined,
      })
    })
  })

  describe<Context>('database', (it) => {
    it('should save the user and cascade the profile', async({ moduleUser }) => {
      const { User, UserProfile } = moduleUser.getRepositories()
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      await User.save(user)
      const savedUser = await User.countBy({ id: user.id })
      const savedProfile = await UserProfile.countBy({ user })
      expect(savedUser).toBe(1)
      expect(savedProfile).toBe(1)
    })
  })

  describe<Context>('conflict', (it) => {
    it('should throw an error if the username is already taken', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, { ...FIXTURE_USER_BASIC, email: 'new@acme.com' })
      await moduleUser.getRepositories().User.save(user)
      const shouldReject = createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const error = moduleUser.errors.USER_EMAIL_OR_NAME_TAKEN()
      await expect(shouldReject).rejects.toEqual(error)
    })

    it('should throw an error if the email is already taken', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, { ...FIXTURE_USER_BASIC, username: 'new' })
      await moduleUser.getRepositories().User.save(user)
      const shouldReject = createUser.call(moduleUser, FIXTURE_USER_BASIC)
      const error = moduleUser.errors.USER_EMAIL_OR_NAME_TAKEN()
      await expect(shouldReject).rejects.toEqual(error)
    })

    it('should return the user conflicts but the old user is deleted', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER_BASIC)
      await moduleUser.getRepositories().User.save(user)
      await moduleUser.getRepositories().User.softRemove(user)
      const promise = createUser.call(moduleUser, FIXTURE_USER_BASIC)
      await expect(promise).resolves.not.toThrow()
    })
  })
})
