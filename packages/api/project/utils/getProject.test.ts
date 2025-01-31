/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable unicorn/consistent-function-scoping */
import type { Context } from '../../__fixtures__'
import type { User } from '../../user'
import type { WorkspacePermission } from '../../workspace'
import type { ProjectPermission } from './assertProjectPermission'
import { EXP_UUID, ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { ERRORS as E } from './errors'
import { getProject } from './getProject'

describe.concurrent('getProject', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  interface TestOptions {
    user?: User
    permission: ProjectPermission
    userProjectPermission?: ProjectPermission
    userWorkspacePermission?: WorkspacePermission
    isProjectPublic?: boolean
    isWorkspacePublic?: boolean
  }

  async function createResult(context: Context, options: TestOptions) {
    const { permission, user, userProjectPermission, userWorkspacePermission, isProjectPublic, isWorkspacePublic } = options
    const { workspace } = await context.createWorkspace('workspace', isWorkspacePublic)
    const { project } = await context.createProject('project', workspace, isProjectPublic)
    if (user && userProjectPermission) await context.assignProject(project, user, userProjectPermission)
    if (user && userWorkspacePermission) await context.assignWorkspace(workspace, user, userWorkspacePermission)
    return await getProject.call(context.moduleProject, { user, workspace: workspace.name, name: project.name, permission })
  }

  async function expectOk(result: Promise<unknown>) {
    await expect(result).resolves.toMatchObject({
      id: expect.stringMatching(EXP_UUID),
      name: 'project',
    })
  }

  async function expectNotAuthorized(shouldReject: Promise<unknown>) {
    const error = E.PROJECT_UNAUTHORIZED('workspace', 'project')
    await expect(shouldReject).rejects.toThrow(error)
  }

  async function expectNotFound(shouldReject: Promise<unknown>) {
    const error = E.PROJECT_NOT_FOUND('workspace', 'project')
    await expect(shouldReject).rejects.toThrow(error)
  }

  const allWorkspacePermissions = ['Owner', 'Write', 'Read', undefined] as const
  const allProjectPermissions = ['Owner', 'Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute', 'Read', undefined] as const

  for (const isWorkspacePublic of [true, false]) {
    describe<Context>(isWorkspacePublic ? 'with public workspace' : 'with private workspace', () => {
      for (const isProjectPublic of [true, false]) {
        describe<Context>(isProjectPublic ? 'with public project' : 'with private project', () => {
          for (const userWorkspacePermission of allWorkspacePermissions) {
            describe<Context>(`with user with "${userWorkspacePermission}" permission on workspace`, () => {
              for (const userProjectPermission of allProjectPermissions) {
                describe<Context>(`with user with "${userProjectPermission}" permission on project`, (it) => {
                  for (const permission of allProjectPermissions) {
                    if (!permission) continue
                    const isPublic = isProjectPublic && isWorkspacePublic
                    const hasImplicitReadAccess = userWorkspacePermission && userProjectPermission
                    const hasProjectPermission = userProjectPermission === permission || userProjectPermission === 'Owner'

                    // --- If the user is the owner of the workspace, bypass all checks.
                    let error: Error | undefined
                    if (userWorkspacePermission === 'Owner') {
                      error = undefined
                    }

                    // --- If the request permission is 'Read', allow public projects within
                    // --- user-accessible workspaces to be retrieved. In our context, any
                    // --- permission on a workspace and project implicitly grants 'Read' access.
                    else if (permission === 'Read') {
                      if (!isPublic && !hasImplicitReadAccess)
                        error = E.PROJECT_NOT_FOUND('workspace', 'project')
                    }

                    // --- For any other permission, the user must have implicit 'Read' access
                    // --- to the workspace and a matching permission to the project itself.
                    else if (!hasImplicitReadAccess || !hasProjectPermission) {
                      error = E.PROJECT_UNAUTHORIZED('workspace', 'project')
                    }

                    if (error) {
                      it(`should throw when the request permission is "${permission}"`, async(context) => {
                        const { user } = await context.createUser()
                        const options = { user, userProjectPermission, userWorkspacePermission, permission, isProjectPublic, isWorkspacePublic }
                        const shouldReject = createResult(context, options)
                        await expect(shouldReject).rejects.toThrow(error)
                      })
                    }

                    else {
                      it(`should resolve if the request permission is "${permission}"`, async(context) => {
                        const { user } = await context.createUser()
                        const options = { user, userProjectPermission, userWorkspacePermission, permission, isProjectPublic, isWorkspacePublic }
                        const result = createResult(context, options)
                        await expectOk(result)
                      })
                    }
                  }
                })
              }
            })
          }

          describe<Context>('without user', (it) => {
            for (const permission of allProjectPermissions.filter(Boolean)) {
              if (!permission) continue
              if (isProjectPublic && isWorkspacePublic && permission === 'Read') {
                it(`should resolve if the request permission is "${permission}"`, async(context) => {
                  const result = createResult(context, { permission, isProjectPublic, isWorkspacePublic })
                  await expectOk(result)
                })
              }
              else if (permission === 'Read') {
                it(`should throw an error if the request permission is "${permission}"`, async(context) => {
                  const shouldReject = createResult(context, { permission, isProjectPublic, isWorkspacePublic })
                  await expectNotFound(shouldReject)
                })
              }
              else {
                it(`should throw an error if the request permission is "${permission}"`, async(context) => {
                  const shouldReject = createResult(context, { permission, isProjectPublic, isWorkspacePublic })
                  await expectNotAuthorized(shouldReject)
                })
              }
            }
          })
        })
      }
    })
  }

  describe<Context>('edge cases', (it) => {
    it('should throw if the project is not found', async({ createWorkspace, moduleProject }) => {
      await createWorkspace('workspace', true)
      const shouldReject = getProject.call(moduleProject, { name: 'project', workspace: 'workspace', permission: 'Read' })
      const error = moduleProject.errors.PROJECT_NOT_FOUND('workspace', 'project')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the workspace is not found', async({ expect, moduleProject }) => {
      const shouldReject = getProject.call(moduleProject, { name: 'project', workspace: 'not-found', permission: 'Read' })
      const error = moduleProject.errors.PROJECT_NOT_FOUND('not-found', 'project')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the request permission is not provided', async({ moduleProject }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getProject.call(moduleProject, { name: 'project', workspace: 'workspace', permission: undefined })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw if the request permission is invalid', async({ moduleProject }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getProject.call(moduleProject, { name: 'project', workspace: 'not-found', permission: 'Invalid' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw if project name is empty', async({ moduleProject }) => {
      const shouldReject = getProject.call(moduleProject, { name: '', workspace: 'not-found', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw if workspace name is empty', async({ moduleProject }) => {
      const shouldReject = getProject.call(moduleProject, { name: 'project', workspace: '', permission: 'Read' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw if the user is not provided', async({ moduleProject }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getProject.call(moduleProject, { user: null, name: 'project', workspace: 'workspace', permission: 'Read' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })

    it('should throw if the user does not have an "id" property', async({ moduleProject }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = getProject.call(moduleProject, { user: {}, name: 'project', workspace: 'workspace', permission: 'Read' })
      await expect(shouldReject).rejects.toThrowError(ValidationError)
    })
  })
}, 1000)
