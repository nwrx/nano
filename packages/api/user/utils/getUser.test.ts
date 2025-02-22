// import { resolveUser } from './resolveUser'

import type { Context } from '../../__fixtures__'
import { createTestContext } from '../../__fixtures__'
import { User } from '../entities'
import { getUser } from './getUser'

describe.concurrent<Context>('getUser', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('with super administrator', () => {
    describe<Context>('with existing user', (it) => {
      it('should get a user by username', async({ moduleUser, setupUser }) => {
        const { user: admin } = await setupUser({ isSuperAdministrator: true })
        const { user } = await setupUser()
        const result = await getUser.call(moduleUser, { user: admin, username: user.username })
        expect(result).toBeInstanceOf(User)
        expect(result.id).toStrictEqual(user.id)
        expect(result.profile).toBeUndefined()
      })

      it('should get own user', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser({ isSuperAdministrator: true })
        const result = await getUser.call(moduleUser, { user, username: user.username })
        expect(result).toBeInstanceOf(User)
        expect(result.id).toStrictEqual(user.id)
        expect(result.profile).toBeUndefined()
      })

      it('should get profile when "withProfile" is true', async({ moduleUser, setupUser }) => {
        const { user: admin } = await setupUser({ isSuperAdministrator: true })
        const { user } = await setupUser()
        const result = await getUser.call(moduleUser, { user: admin, username: user.username, withProfile: true })
        expect(result.profile).toBeDefined()
        expect(result.profile!.id).toStrictEqual(user.profile!.id)
      })

      it('should get deleted user when "withDeleted" is true', async({ moduleUser, setupUser }) => {
        const { user: admin } = await setupUser({ isSuperAdministrator: true })
        const { user } = await setupUser({ deletedAt: new Date() })
        const result = await getUser.call(moduleUser, { user: admin, username: user.username, withDeleted: true })
        expect(result.id).toStrictEqual(user.id)
        expect(result.profile).toBeUndefined()
      })

      it('should get disabled user when "withDisabled" is true', async({ moduleUser, setupUser }) => {
        const { user: admin } = await setupUser({ isSuperAdministrator: true })
        const { user } = await setupUser({ disabledAt: new Date() })
        const result = await getUser.call(moduleUser, { user: admin, username: user.username, withDisabled: true })
        expect(result.id).toStrictEqual(user.id)
        expect(result.profile).toBeUndefined()
      })
    })

    describe<Context>('errors', (it) => {
      it('should throw an error if the user does not exist', async({ moduleUser, setupUser }) => {
        const { user: admin } = await setupUser({ isSuperAdministrator: true })
        const shouldReject = getUser.call(moduleUser, { user: admin, username: 'does-not-exist' })
        const error = moduleUser.errors.USER_NOT_FOUND('does-not-exist')
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error if the user is deleted', async({ moduleUser, setupUser }) => {
        const { user: admin } = await setupUser({ isSuperAdministrator: true })
        const { user: deleted } = await setupUser({ deletedAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { user: admin, username: deleted.username })
        const error = moduleUser.errors.USER_NOT_FOUND(deleted.username)
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error if the user is disabled', async({ moduleUser, setupUser }) => {
        const { user: admin } = await setupUser({ isSuperAdministrator: true })
        const { user: disabled } = await setupUser({ disabledAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { user: admin, username: disabled.username })
        const error = moduleUser.errors.USER_NOT_FOUND(disabled.username)
        await expect(shouldReject).rejects.toEqual(error)
      })
    })
  })

  describe<Context>('with normal user', () => {
    describe<Context>('with existing user', (it) => {
      it('should get a user by username', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser()
        const { user: other } = await setupUser()
        const result = await getUser.call(moduleUser, { user, username: other.username })
        expect(result).toBeInstanceOf(User)
        expect(result.id).toStrictEqual(other.id)
        expect(result.profile).toBeUndefined()
      })

      it('should get profile when "withProfile" is true', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser()
        const { user: other } = await setupUser()
        const result = await getUser.call(moduleUser, { user, username: other.username, withProfile: true })
        expect(result.profile).toBeDefined()
        expect(result.profile!.id).toStrictEqual(other.profile!.id)
      })

      it('should get own user', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser()
        const result = await getUser.call(moduleUser, { user, username: user.username })
        expect(result).toBeInstanceOf(User)
        expect(result.id).toStrictEqual(user.id)
        expect(result.profile).toBeUndefined()
      })
    })

    describe<Context>('errors', (it) => {
      it('should throw an error if the user does not exist', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser()
        const shouldReject = getUser.call(moduleUser, { user, username: 'does-not-exist' })
        const error = moduleUser.errors.USER_NOT_FOUND('does-not-exist')
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error if the user is deleted', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser()
        const { user: deleted } = await setupUser({ deletedAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { user, username: deleted.username })
        const error = moduleUser.errors.USER_NOT_FOUND(deleted.username)
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error if the user is disabled', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser()
        const { user: disabled } = await setupUser({ disabledAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { user, username: disabled.username })
        const error = moduleUser.errors.USER_NOT_FOUND(disabled.username)
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error when "withDeleted" is true', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser()
        const { user: deleted } = await setupUser({ deletedAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { user, username: deleted.username, withDeleted: true })
        const error = moduleUser.errors.USER_FORBIDDEN()
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error when "withDisabled" is true', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser()
        const { user: disabled } = await setupUser({ disabledAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { user, username: disabled.username, withDisabled: true })
        const error = moduleUser.errors.USER_FORBIDDEN()
        await expect(shouldReject).rejects.toEqual(error)
      })
    })
  })

  describe<Context>('without user', () => {
    describe<Context>('with existing user', (it) => {
      it('should get a user by username', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser()
        const result = await getUser.call(moduleUser, { username: user.username })
        expect(result).toBeInstanceOf(User)
        expect(result.id).toStrictEqual(user.id)
        expect(result.profile).toBeUndefined()
      })

      it('should get profile when "withProfile" is true', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser()
        const result = await getUser.call(moduleUser, { username: user.username, withProfile: true })
        expect(result.profile).toBeDefined()
        expect(result.profile!.id).toStrictEqual(user.profile!.id)
      })
    })

    describe<Context>('errors', (it) => {
      it('should throw an error if the user does not exist', async({ moduleUser }) => {
        const shouldReject = getUser.call(moduleUser, { username: 'does-not-exist' })
        const error = moduleUser.errors.USER_NOT_FOUND('does-not-exist')
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error if the user is deleted', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser({ deletedAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { username: user.username })
        const error = moduleUser.errors.USER_NOT_FOUND(user.username)
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error if the user is disabled', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser({ disabledAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { username: user.username })
        const error = moduleUser.errors.USER_NOT_FOUND(user.username)
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error when "withDeleted" is true', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser({ deletedAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { username: user.username, withDeleted: true })
        const error = moduleUser.errors.USER_FORBIDDEN()
        await expect(shouldReject).rejects.toEqual(error)
      })

      it('should throw an error when "withDisabled" is true', async({ moduleUser, setupUser }) => {
        const { user } = await setupUser({ disabledAt: new Date() })
        const shouldReject = getUser.call(moduleUser, { username: user.username, withDisabled: true })
        const error = moduleUser.errors.USER_FORBIDDEN()
        await expect(shouldReject).rejects.toEqual(error)
      })
    })
  })
})
