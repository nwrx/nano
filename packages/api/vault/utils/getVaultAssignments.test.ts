import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { getVaultAssignments } from './getVaultAssignments'

describe('getVaultAssignments', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('success cases', (it) => {
    it('should return assignments for a vault with multiple users', async({ setupUser, setupVault, moduleVault }) => {
      // Setup users with profiles
      const { user: user1 } = await setupUser()
      const { user: user2 } = await setupUser()

      // Setup vault with assignments
      const { vault } = await setupVault({ assignments: [[user1, 'Owner'], [user2, 'Read'], [user2, 'Write']] })

      // Get and verify assignments
      const result = await getVaultAssignments.call(moduleVault, { vault })
      expect(result).toHaveLength(3)
      expect(result).toEqual(expect.arrayContaining([
        { username: user1.username, displayName: user1.profile!.displayName, permissions: ['Owner'] },
        { username: user2.username, displayName: user2.profile!.displayName, permissions: ['Read', 'Write'] },
      ]))
    })

    it('should return empty array for vault with only one user', async({ setupVault, moduleVault }) => {
      const { vault } = await setupVault()
      const result = await getVaultAssignments.call(moduleVault, { vault })
      expect(result).toHaveLength(1)
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw ValidationError if vault is not provided', async(context) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getVaultAssignments.call(context.moduleVault, {})
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError if vault is invalid', async(context) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getVaultAssignments.call(context.moduleVault, { vault: {} })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })
  })
})
