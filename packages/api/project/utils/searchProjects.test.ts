/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import type { User } from '../../user'
import type { WorkspacePermission } from '../../workspace'
import type { ProjectPermission } from './assertProjectPermission'
import { EXP_UUID, ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { searchProjects } from './searchProjects'

describe.concurrent('searchProjects', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  interface TestOptions {
    user?: User
    search: string
    userProjectPermission?: ProjectPermission
    userWorkspacePermission?: WorkspacePermission
    isProjectPublic?: boolean
    isWorkspacePublic?: boolean
  }

  async function createResult(context: Context, options: TestOptions) {
    const { user, search, userProjectPermission, userWorkspacePermission, isProjectPublic, isWorkspacePublic } = options
    const { workspace } = await context.createWorkspace('workspace', isWorkspacePublic)
    const { project } = await context.createProject('project', workspace, { isPublic: isProjectPublic, title: 'Test Project' })
    if (user && userProjectPermission) await context.assignProject(project, user, userProjectPermission)
    if (user && userWorkspacePermission) await context.assignWorkspace(workspace, user, userWorkspacePermission)
    return await searchProjects.call(context.moduleProject, { user, search })
  }

  const allWorkspacePermissions = ['Owner', 'Write', 'Read', undefined] as const
  const allProjectPermissions = ['Owner', 'Write', 'Read', undefined] as const

  for (const isWorkspacePublic of [true, false]) {
    describe<Context>(isWorkspacePublic ? 'with public workspace' : 'with private workspace', { timeout: 300 }, () => {
      for (const isProjectPublic of [true, false]) {
        describe<Context>(isProjectPublic ? 'with public project' : 'with private project', () => {
          for (const userWorkspacePermission of allWorkspacePermissions) {
            describe<Context>(`with user with "${userWorkspacePermission}" permission on workspace`, () => {
              for (const userProjectPermission of allProjectPermissions) {
                describe<Context>(`with user with "${userProjectPermission}" permission on project`, (it) => {
                  const isPublic = isProjectPublic && isWorkspacePublic
                  const hasWorkspaceRead = userWorkspacePermission === 'Read' || userWorkspacePermission === 'Owner'
                  const hasProjectRead = userProjectPermission === 'Read' || userProjectPermission === 'Owner'
                  const hasAccess = hasWorkspaceRead && hasProjectRead

                  if (isPublic) {
                    it('should find project by name when public', async(context) => {
                      const result = await createResult(context, { search: 'proj', isProjectPublic, isWorkspacePublic })
                      expect(result).toHaveLength(1)
                      expect(result[0]).toMatchObject({ id: expect.stringMatching(EXP_UUID) })
                    })
                  }
                  else {
                    it('should not find private project without access', async(context) => {
                      const { user } = await context.createUser()
                      const result = await createResult(context, { user, search: 'proj', isProjectPublic, isWorkspacePublic })
                      expect(result).toHaveLength(0)
                    })
                  }

                  if (hasAccess) {
                    it('should find project when user has access', async(context) => {
                      const { user } = await context.createUser()
                      const result = await createResult(context, {
                        user,
                        search: 'proj',
                        userProjectPermission,
                        userWorkspacePermission,
                        isProjectPublic,
                        isWorkspacePublic,
                      })
                      expect(result).toHaveLength(1)
                      expect(result[0]).toMatchObject({ id: expect.stringMatching(EXP_UUID) })
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  }

  describe<Context>('edge cases', { timeout: 300 }, (it) => {
    it('should return empty array when no matches found', async(context) => {
      const results = await searchProjects.call(context.moduleProject, { search: 'nonexistent' })
      expect(results).toEqual([])
    })

    it('should throw if search string is empty', async({ moduleProject }) => {
      const shouldReject = searchProjects.call(moduleProject, { search: '' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw if user object is invalid', async({ moduleProject }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = searchProjects.call(moduleProject, { search: 'test', user: {} })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should escape non-alphanumeric characters', async(context) => {
      const { workspace } = await context.createWorkspace('workspace', true)
      await context.createProject('project', workspace, { isPublic: true })
      const results = await searchProjects.call(context.moduleProject, { search: '%_!@#$%^&*()_+' })
      expect(results).toHaveLength(0)
    })

    it('should return empty array when search string is less than 3 characters', async(context) => {
      await context.createUser()
      const { workspace } = await context.createWorkspace('workspace', true)
      await context.createProject('project', workspace, { isPublic: true })
      const results = await searchProjects.call(context.moduleProject, { search: 'pr' })
      expect(results).toEqual([])
    })

    it('should find using case-insensitive search', async(context) => {
      const { workspace } = await context.createWorkspace('workspace', true)
      await context.createProject('project', workspace, { isPublic: true })
      const results = await searchProjects.call(context.moduleProject, { search: 'PROJ' })
      expect(results).toHaveLength(1)
    })
  })
})
