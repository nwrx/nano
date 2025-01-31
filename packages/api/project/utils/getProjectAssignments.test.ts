import type { User } from '../../user'
import type { Project } from '../entities'
import type { ProjectPermission } from './assertProjectPermission'
import { getProjectAssignments } from './getProjectAssignments'

describe('getProjectAssignments', () => {
  it('should return assignments grouped by users', () => {
    const project = {
      assignments: [
        { user: { username: 'user1' } as User, permission: 'Read' as ProjectPermission },
        { user: { username: 'user2' } as User, permission: 'Write' as ProjectPermission },
        { user: { username: 'user1' } as User, permission: 'Owner' as ProjectPermission },
      ],
    } as Project

    const result = getProjectAssignments(project)
    expect(result).toEqual([
      { user: { username: 'user1' }, permissions: ['Read', 'Owner'] },
      { user: { username: 'user2' }, permissions: ['Write'] },
    ])
  })

  it('should throw an error if assignments are not loaded', () => {
    // @ts-expect-error: ignore type mismatch
    const project: Project = { assignments: undefined }
    const shouldThrow = () => getProjectAssignments(project)
    expect(shouldThrow).toThrow('Assignments relation is not loaded.')
  })

  it('should return an empty array if there are no assignments', () => {
    // @ts-expect-error: ignore type mismatch
    const project = { assignments: [] } as Project
    const result = getProjectAssignments(project)
    expect(result).toEqual([])
  })
})
