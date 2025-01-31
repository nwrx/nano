import type { User } from '../../user'
import type { Workspace } from '../entities'
import { getWorkspaceUserAssignments } from './getWorkspaceUserAssignments'

describe('getWorkspaceAssignments', () => {
  it('should return assignments grouped by users', () => {
    const workspace = {
      assignments: [
        { user: { username: 'user1' } as User, permission: 'Read' },
        { user: { username: 'user2' } as User, permission: 'Write' },
        { user: { username: 'user1' } as User, permission: 'Owner' },
      ],
    } as Workspace

    const result = getWorkspaceUserAssignments(workspace)
    expect(result).toEqual([
      { user: { username: 'user1' }, permissions: ['Read', 'Owner'] },
      { user: { username: 'user2' }, permissions: ['Write'] },
    ])
  })

  it('should throw an error if assignments are not loaded', () => {
    // @ts-expect-error: ignore type mismatch
    const workspace: Workspace = { assignments: undefined }
    const shouldThrow = () => getWorkspaceUserAssignments(workspace)
    expect(shouldThrow).toThrow('The assignments are not loaded.')
  })

  it('should return an empty array if there are no assignments', () => {
    // @ts-expect-error: ignore type mismatch
    const workspace = { assignments: [] } as Workspace
    const result = getWorkspaceUserAssignments(workspace)
    expect(result).toEqual([])
  })
})
