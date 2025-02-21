// import { resolveUser } from './resolveUser'

import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'
import { User } from '../entities'
import { getUser } from './getUser'

describe.concurrent<Context>('getUser', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
    await context.application.createTestServer()
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('as super administrator', () => {
    describe<Context>('with existing user', (it) => {
      it('should get a user by username', async({ moduleUser, createUser }) => {
        const { user } = await createUser('admin', { isSuperAdministrator: true })
        const { user: jdoe } = await createUser('jdoe')
        const result = await getUser.call(moduleUser, { user, username: 'jdoe' })
        expect(result).toBeInstanceOf(User)
        expect(result.id).toStrictEqual(jdoe.id)
        expect(result.profile).toBeUndefined()
      })

      it('should get own user', async({ moduleUser, createUser }) => {
        const { user } = await createUser('admin', { isSuperAdministrator: true })
        const result = await getUser.call(moduleUser, { user, username: 'admin' })
        expect(result).toBeInstanceOf(User)
        expect(result.id).toStrictEqual(user.id)
        expect(result.profile).toBeUndefined()
      })

      it('should get profile when "withProfile" is true', async({ moduleUser, createUser }) => {
        const { user } = await createUser('admin', { isSuperAdministrator: true })
        const { user: jdoe } = await createUser('jdoe')
        const result = await getUser.call(moduleUser, { user, username: 'jdoe', withProfile: true })
        expect(result.profile).toBeDefined()
        expect(result.profile).toMatchObject({
          id: jdoe.profile!.id,
          avatar: null,
        })
      })

      it('should get deleted user when "withDeleted" is true', async({ moduleUser, createUser }) => {
        const { user } = await createUser('admin', { isSuperAdministrator: true })
        const { user: jdoe } = await createUser('jdoe', { deletedAt: new Date() })
        const result = await getUser.call(moduleUser, { user, username: 'jdoe', withDeleted: true })
        expect(result.id).toStrictEqual(jdoe.id)
      })

      it('should get disabled user when "withDisabled" is true', async({ moduleUser, createUser }) => {
        const { user } = await createUser('admin', { isSuperAdministrator: true })
        const { user: jdoe } = await createUser('jdoe', { disabledAt: new Date() })
        const result = await getUser.call(moduleUser, { user, username: 'jdoe', withDisabled: true })
        expect(result.id).toStrictEqual(jdoe.id)
      })
    })

    describe<Context>('errors', (it) => {
      it('should throw an error if the user does not exist', async({ moduleUser, createUser }) => {
        const { user } = await createUser('admin', { isSuperAdministrator: true })
        const shouldReject = getUser.call(moduleUser, { user, username: 'jdoe' })
        const error = moduleUser.errors.USER_NOT_FOUND('jdoe')
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error if the user is deleted', async({ moduleUser, createUser }) => {
        const { user } = await createUser('admin', { isSuperAdministrator: true })
        await createUser('jdoe', { deletedAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { user, username: 'jdoe' })
        const error = moduleUser.errors.USER_NOT_FOUND('jdoe')
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error if the user is disabled', async({ moduleUser, createUser }) => {
        const { user } = await createUser('admin', { isSuperAdministrator: true })
        await createUser('jdoe', { disabledAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { user, username: 'jdoe' })
        const error = moduleUser.errors.USER_NOT_FOUND('jdoe')
        await expect(shouldReject).rejects.toEqual(error)
      })
    })
  })

  describe<Context>('as user', () => {
    describe<Context>('with existing user', (it) => {
      it('should get a user by username', async({ moduleUser, createUser }) => {
        const { user } = await createUser('jdoe')
        const { user: bob } = await createUser('bob')
        const result = await getUser.call(moduleUser, { user, username: 'bob' })
        expect(result).toBeInstanceOf(User)
        expect(result.id).toStrictEqual(bob.id)
        expect(result.profile).toBeUndefined()
      })

      it('should get profile when "withProfile" is true', async({ moduleUser, createUser }) => {
        const { user } = await createUser('jdoe')
        const { user: bob } = await createUser('bob')
        const result = await getUser.call(moduleUser, { user, username: 'bob', withProfile: true })
        expect(result.profile).toBeDefined()
        expect(result.profile!.id).toStrictEqual(bob.profile!.id)
      })

      it('should get own user', async({ moduleUser, createUser }) => {
        const { user } = await createUser('jdoe')
        const result = await getUser.call(moduleUser, { user, username: 'jdoe' })
        expect(result).toBeInstanceOf(User)
        expect(result.id).toStrictEqual(user.id)
        expect(result.profile).toBeUndefined()
      })
    })

    describe<Context>('errors', (it) => {
      it('should throw an error if the user does not exist', async({ moduleUser, createUser }) => {
        const { user } = await createUser('jdoe')
        const shouldReject = getUser.call(moduleUser, { user, username: 'bob' })
        const error = moduleUser.errors.USER_NOT_FOUND('bob')
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error if the user is deleted', async({ moduleUser, createUser }) => {
        const { user } = await createUser('jdoe')
        await createUser('bob', { deletedAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { user, username: 'bob' })
        const error = moduleUser.errors.USER_NOT_FOUND('bob')
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error if the user is disabled', async({ moduleUser, createUser }) => {
        const { user } = await createUser('jdoe')
        await createUser('bob', { disabledAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { user, username: 'bob' })
        const error = moduleUser.errors.USER_NOT_FOUND('bob')
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error when "withDeleted" is true', async({ moduleUser, createUser }) => {
        const { user } = await createUser('jdoe')
        await createUser('bob', { deletedAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { user, username: 'bob', withDeleted: true })
        const error = moduleUser.errors.USER_FORBIDDEN()
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error when "withDisabled" is true', async({ moduleUser, createUser }) => {
        const { user } = await createUser('jdoe')
        await createUser('bob', { disabledAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { user, username: 'bob', withDisabled: true })
        const error = moduleUser.errors.USER_FORBIDDEN()
        await expect(shouldReject).rejects.toEqual(error)
      })
    })
  })

  describe<Context>('as unauthenticated', () => {
    describe<Context>('with existing user', (it) => {
      it('should get a user by username', async({ moduleUser, createUser }) => {
        const { user: bob } = await createUser('bob')
        const result = await getUser.call(moduleUser, { username: 'bob' })
        expect(result).toBeInstanceOf(User)
        expect(result.id).toStrictEqual(bob.id)
        expect(result.profile).toBeUndefined()
      })

      it('should get profile when "withProfile" is true', async({ moduleUser, createUser }) => {
        const { user: bob } = await createUser('bob')
        const result = await getUser.call(moduleUser, { username: 'bob', withProfile: true })
        expect(result.profile).toBeDefined()
        expect(result.profile!.id).toStrictEqual(bob.profile!.id)
      })
    })

    describe<Context>('errors', (it) => {
      it('should throw an error if the user does not exist', async({ moduleUser }) => {
        const shouldReject = getUser.call(moduleUser, { username: 'bob' })
        const error = moduleUser.errors.USER_NOT_FOUND('bob')
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error if the user is deleted', async({ moduleUser, createUser }) => {
        await createUser('bob', { deletedAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { username: 'bob' })
        const error = moduleUser.errors.USER_NOT_FOUND('bob')
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error if the user is disabled', async({ moduleUser, createUser }) => {
        await createUser('bob', { disabledAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { username: 'bob' })
        const error = moduleUser.errors.USER_NOT_FOUND('bob')
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error when "withDeleted" is true', async({ moduleUser, createUser }) => {
        await createUser('bob', { deletedAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { username: 'bob', withDeleted: true })
        const error = moduleUser.errors.USER_FORBIDDEN()
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error when "withDisabled" is true', async({ moduleUser, createUser }) => {
        await createUser('jdoe')
        await createUser('bob', { disabledAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { username: 'bob', withDisabled: true })
        const error = moduleUser.errors.USER_FORBIDDEN()
        await expect(shouldReject).rejects.toEqual(error)
      })
    })
  })
}, 1000)
