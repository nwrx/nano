/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EXP_UUID } from '@unshared/validation'
import { type Context, createTestContext } from '../../__fixtures__'
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
      const user = await createUser.call(moduleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
      expect({ ...user }).toStrictEqual({
        id: expect.stringMatching(EXP_UUID),
        isSuperAdministrator: undefined,
        username: 'jdoe',
        email: 'jdoe@acme.com',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: undefined,
        disabledAt: undefined,
        verifiedAt: undefined,
        passwords: undefined,
        recoveries: undefined,
        sessions: undefined,
        profile: expect.any(Object),
      })
    })

    it('should create the user profile with the same username', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
      expect({ ...user.profile }).toStrictEqual({
        id: expect.stringMatching(EXP_UUID),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: undefined,
        displayName: 'jdoe',
        biography: '',
        company: '',
        socials: [],
        website: '',
        user: undefined,
        avatar: undefined,
      })
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if the username is already taken', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
      await moduleUser.getRepositories().User.save(user)
      const shouldReject = createUser.call(moduleUser, { username: 'jdoe', email: 'not-jdoe@acme.com' })
      const error = moduleUser.errors.USER_EMAIL_OR_NAME_TAKEN()
      await expect(shouldReject).rejects.toEqual(error)
    })

    it('should throw an error if the email is already taken', async({ moduleUser }) => {
      const user = await createUser.call(moduleUser, { username: 'jdoe', email: 'jdoe@acme.com' })
      await moduleUser.getRepositories().User.save(user)
      const shouldReject = createUser.call(moduleUser, { username: 'not-jdoe', email: 'jdoe@acme.com' })
      const error = moduleUser.errors.USER_EMAIL_OR_NAME_TAKEN()
      await expect(shouldReject).rejects.toEqual(error)
    })
  })
})
