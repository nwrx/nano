import type { Context } from '../../__fixtures__'
import { AssertionError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { getProjectAssignments } from './getProjectAssignments'

describe('getProjectAssignments', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('success cases', (it) => {
    it('should return assignments for a project with multiple users', async(context) => {
      // Setup users with profiles
      const { user: user1 } = await context.setupUser()
      const { user: user2 } = await context.setupUser()
      const { project } = await context.setupProject({ assignments: [[user1, 'Owner'], [user2, 'Read'], [user2, 'Write']] })

      // Get and verify assignments
      const result = await getProjectAssignments.call(context.moduleProject, { project })
      expect(result).toHaveLength(2)
      expect(result).toEqual(expect.arrayContaining([
        { username: user1.username, displayName: user1.profile!.displayName, permissions: ['Owner'] },
        { username: user2.username, displayName: user2.profile!.displayName, permissions: ['Read', 'Write'] },
      ]))
    })

    it('should return empty array for project with no assignments', async(context) => {
      const { project } = await context.setupProject()
      const result = await getProjectAssignments.call(context.moduleProject, { project })
      expect(result).toEqual([])
    })
  })

  describe<Context>('validation', (it) => {
    it('should throw AssertionError if project is not provided', async(context) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getProjectAssignments.call(context.moduleProject, {})
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw AssertionError if project is invalid', async(context) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getProjectAssignments.call(context.moduleProject, { project: {} })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })
  })
})
