import type { Context } from '../../__fixtures__'
import { AssertionError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { getVaultUserPermissions } from './getVaultUserPermissions'

describe('getVaultUserPermissions', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('success cases', (it) => {
    it('should return assignments for a vault with multiple users', async({ setupUser, setupVault, moduleVault }) => {
      const { user: user1 } = await setupUser()
      const { user: user2 } = await setupUser()
      const { vault } = await setupVault({ user: user1, assignments: [[user1, 'Read'], [user2, 'Read'], [user2, 'Write']] })
      const result = await getVaultUserPermissions.call(moduleVault, { vault })
      expect(result).toStrictEqual({
        [user1.username]: ['Owner', 'Read'],
        [user2.username]: ['Read', 'Write'],
      })
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw AssertionError on missing options', async(context) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getVaultUserPermissions.call(context.moduleVault, {})
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })
  })
})
