/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import { EXP_UUID } from '@unshared/validation'
import { createTestContext, FIXTURE_USER } from '../../__fixtures__'
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
      const user = await createUser.call(moduleUser, FIXTURE_USER)
      expect({ ...user }).toStrictEqual({
        id: expect.stringMatching(EXP_UUID),
        isSuperAdministrator: undefined,
        username: FIXTURE_USER.username,
        email: FIXTURE_USER.email,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: undefined,
        disabledAt: undefined,
        verifiedAt: undefined,
        profile: expect.any(Object),
      })
    })

    it('should create the user profile with the same username', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER)
      expect({ ...user.profile }).toStrictEqual({
        id: expect.stringMatching(EXP_UUID),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: undefined,
        displayName: FIXTURE_USER.username,
        biography: '',
        company: '',
        socials: [],
        website: '',
        user: undefined,
        avatar: undefined,
      })
    })

    it('should return the user if it conflicts but but the old user is deleted', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, FIXTURE_USER)
      await moduleUser.getRepositories().User.save(user)
      await moduleUser.getRepositories().User.softRemove(user)
      const promise = createUser.call(moduleUser, FIXTURE_USER)
      await expect(promise).resolves.not.toThrow()
    })
  })

  describe<Context>('database', (it) => {
    it('should save the user and cascade the profile', async({ moduleUser }) => {
      const { User, UserProfile } = moduleUser.getRepositories()
      const user = await createUser.call(moduleUser, FIXTURE_USER)
      await User.save(user)
      const savedUser = await User.countBy({ id: user.id })
      const savedProfile = await UserProfile.countBy({ user })
      expect(savedUser).toBe(1)
      expect(savedProfile).toBe(1)
    })
  })

  describe<Context>('conflict', (it) => {
    it('should throw an error if the username is already taken', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, { ...FIXTURE_USER, email: 'new@acme.com' })
      await moduleUser.getRepositories().User.save(user)
      const shouldReject = createUser.call(moduleUser, FIXTURE_USER)
      const error = moduleUser.errors.USER_EMAIL_OR_NAME_TAKEN()
      await expect(shouldReject).rejects.toEqual(error)
    })

    it('should throw an error if the email is already taken', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, { ...FIXTURE_USER, username: 'new' })
      await moduleUser.getRepositories().User.save(user)
      const shouldReject = createUser.call(moduleUser, FIXTURE_USER)
      const error = moduleUser.errors.USER_EMAIL_OR_NAME_TAKEN()
      await expect(shouldReject).rejects.toEqual(error)
    })
  })
})
