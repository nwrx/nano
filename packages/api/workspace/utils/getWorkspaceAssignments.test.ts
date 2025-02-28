import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { getWorkspaceAssignments } from './getWorkspaceAssignments'

describe('getWorkspaceAssignments', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('success cases', (it) => {
    it('should return assignments for a workspace with multiple users', async(context) => {
      // Setup users with profiles
      const { user: user1 } = await context.setupUser()
      const { user: user2 } = await context.setupUser()
      const { workspace } = await context.setupWorkspace({ assignments: [[user1, 'Owner'], [user2, 'Read'], [user2, 'Write']] })

      // Get and verify assignments
      const result = await getWorkspaceAssignments.call(context.moduleWorkspace, { workspace })
      expect(result).toHaveLength(2)
      expect(result).toEqual(expect.arrayContaining([
        { username: user1.username, displayName: user1.profile!.displayName, permissions: ['Owner'] },
        { username: user2.username, displayName: user2.profile!.displayName, permissions: ['Read', 'Write'] },
      ]))
    })

    it('should return empty array for workspace with no assignments', async(context) => {
      const { workspace } = await context.setupWorkspace()
      const result = await getWorkspaceAssignments.call(context.moduleWorkspace, { workspace })
      expect(result).toEqual([])
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw ValidationError if workspace is not provided', async(context) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getWorkspaceAssignments.call(context.moduleWorkspace, {})
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw ValidationError if workspace is invalid', async(context) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getWorkspaceAssignments.call(context.moduleWorkspace, { workspace: {} })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })
  })
})
