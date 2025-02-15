/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Context } from '../../__fixtures__'
import type { User } from '../../user'
import type { WorkspacePermission } from '../../workspace'
import type { ProjectPermission } from './assertProjectPermission'
import { EXP_UUID } from '@unshared/validation'
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
    search?: string
    workspace?: string
    userProjectPermission?: ProjectPermission
    userWorkspacePermission?: WorkspacePermission
    isProjectPublic?: boolean
    isWorkspacePublic?: boolean
    findOptions?: {
      relations?: string[]
      skip?: number
      take?: number
    }
  }

  async function createResult(context: Context, options: TestOptions) {
    const { user, search, workspace, userProjectPermission, userWorkspacePermission, isProjectPublic, isWorkspacePublic, findOptions } = options
    const { workspace: createdWorkspace } = await context.createWorkspace('workspace', isWorkspacePublic)
    const { project } = await context.createProject('project', createdWorkspace, { isPublic: isProjectPublic, title: 'Test Project' })
    if (user && userProjectPermission) await context.assignProject(project, user, userProjectPermission)
    if (user && userWorkspacePermission) await context.assignWorkspace(createdWorkspace, user, userWorkspacePermission)
    return await searchProjects.call(context.moduleProject, {
      user,
      search,
      workspace,
      ...findOptions,
    })
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

    it('should find using case-insensitive search', async(context) => {
      const { workspace } = await context.createWorkspace('workspace', true)
      await context.createProject('project', workspace, { isPublic: true })
      const results = await searchProjects.call(context.moduleProject, { search: 'PROJ' })
      expect(results).toHaveLength(1)
    })

    it('should return all projects when search is not provided', async(context) => {
      const { workspace } = await context.createWorkspace('workspace', true)
      await context.createProject('project1', workspace, { isPublic: true })
      await context.createProject('project2', workspace, { isPublic: true })
      const results = await searchProjects.call(context.moduleProject, {})
      expect(results.length).toBeGreaterThanOrEqual(2)
    })

    it('should return projects without workspace specified', async(context) => {
      const { workspace } = await context.createWorkspace('workspace', true)
      await context.createProject('project', workspace, { isPublic: true })
      const results = await searchProjects.call(context.moduleProject, { search: 'project' })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('project')
    })

    it('should respect pagination and ordering options', async(context) => {
      const { workspace } = await context.createWorkspace('workspace', true)
      await context.createProject('project1', workspace, { isPublic: true })
      await context.createProject('project2', workspace, { isPublic: true })
      await context.createProject('project3', workspace, { isPublic: true })
      const results = await searchProjects.call(context.moduleProject, { skip: 1, take: 1, order: { name: 'ASC' } })
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('project2')
    })

    it('should load relations when specified', async(context) => {
      const { workspace } = await context.createWorkspace('workspace', true)
      await context.createProject('project', workspace, { isPublic: true })
      const results = await searchProjects.call(context.moduleProject, { relations: { workspace: true } })
      expect(results).toHaveLength(1)
      expect(results[0].workspace).toBeDefined()
    })

    describe('search string sanitization', () => {
      it('should sanitize special characters from search string', async(context) => {
        const { workspace } = await context.createWorkspace('workspace', true)
        await context.createProject('project123', workspace, { isPublic: true })
        const specialChars = ['!@#$%^&*()', '+-=[]{}|;:', '"\'<>,.?/\\']
        for (const chars of specialChars) {
          const results = await searchProjects.call(context.moduleProject, { search: `project${chars}123` })
          expect(results).toHaveLength(1)
          expect(results[0].name).toBe('project123')
        }
      })

      it('should preserve spaces and alphanumeric characters', async(context) => {
        const { workspace } = await context.createWorkspace('workspace', true)
        await context.createProject('project 123', workspace, { isPublic: true })
        const results = await searchProjects.call(context.moduleProject, { search: 'project 123' })
        expect(results).toHaveLength(1)
        expect(results[0].name).toBe('project 123')
      })
    })

    describe('search operator behavior', () => {
      it('should use ILIKE operator for searches less than 3 characters', async(context) => {
        const { workspace } = await context.createWorkspace('workspace', true)
        await context.createProject('project', workspace, { isPublic: true })
        const results1 = await searchProjects.call(context.moduleProject, { search: 'pr' })
        const results2 = await searchProjects.call(context.moduleProject, { search: 'p' })
        expect(results1).toHaveLength(1)
        expect(results2).toHaveLength(1)
      })

      it('should not use ILIKE operator for searches with 3 or more characters', async(context) => {
        const { workspace } = await context.createWorkspace('workspace', true)
        await context.createProject('project', workspace, { isPublic: true })
        const results = await searchProjects.call(context.moduleProject, { search: 'pro' })
        expect(results).toHaveLength(0) // Because searchOperator is undefined for 3+ chars
      })
    })
  })
})
