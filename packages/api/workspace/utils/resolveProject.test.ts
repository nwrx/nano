/* eslint-disable vitest/prefer-each */
/* eslint-disable no-unexpected-multiline */
import type { Context } from '../../__fixtures__'
import type { WorkspaceProjectPermission } from './assertProjectPermission'
import { randomUUID } from 'node:crypto'
import { createContext } from '../../__fixtures__'
import { resolveProject } from './resolveProject'

describe.concurrent<Context>('resolveProject', () => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  describe<Context>('with public project', () => {

    describe<Context>('with a user with "Owner" permission on workspace', () => {
      for (const projectPermission of ['Owner', 'Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute', 'Read', undefined] as const) {
        describe<Context>(`with a user with "${projectPermission}" permission on project`, (it) => {
          it.for(['Owner', 'Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute', 'Read'] as const)
          ('should resolve if the request permission is "%s"', async(permission, { expect, ctx }) => {
            const { user } = await ctx.createUser()
            const { workspace } = await ctx.createWorkspace('workspace', true)
            const { project } = await ctx.createProject('project', workspace, true)
            await ctx.assignProject(project, user, projectPermission)
            await ctx.assignWorkspace(workspace, user, 'Owner')
            const result = await resolveProject.call(ctx.ModuleWorkspace, { user, workspace, name: 'project', permission })
            expect(result).toMatchObject({ id: project.id })
          })
        })
      }
    })

    for (const workspacePermission of ['Write', 'Read', undefined] as const) {
      describe<Context>(`with a user with "${workspacePermission}" permission on workspace`, () => {

        describe<Context>('with a user with "Owner" permission on project', (it) => {
          it.for(['Owner', 'Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute', 'Read'] as const)
          ('should resolve if the request permission is "%s"', async(permission, { expect, ctx }) => {
            const { user } = await ctx.createUser()
            const { workspace } = await ctx.createWorkspace('workspace', true)
            const { project } = await ctx.createProject('project', workspace, true)
            await ctx.assignProject(project, user, 'Owner')
            await ctx.assignWorkspace(workspace, user, workspacePermission)
            const result = await resolveProject.call(ctx.ModuleWorkspace, { user, workspace, name: 'project', permission })
            expect(result).toMatchObject({ id: project.id })
          })
        })

        for (const projectPermission of ['Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute', 'Read', undefined] as const) {
          describe<Context>(`with a user with "${projectPermission}" permission on project`, (it) => {

            it.for([projectPermission, 'Read'].filter(Boolean) as WorkspaceProjectPermission[])
            ('should resolve if the request permission is "%s"', async(permission, { expect, ctx }) => {
              const { user } = await ctx.createUser()
              const { workspace } = await ctx.createWorkspace('workspace', true)
              const { project } = await ctx.createProject('project', workspace, true)
              await ctx.assignWorkspace(workspace, user, workspacePermission)
              await ctx.assignProject(project, user, projectPermission)
              const result = await resolveProject.call(ctx.ModuleWorkspace, { user, workspace, name: 'project', permission })
              expect(result).toMatchObject({ id: project.id })
            })

            it.for(['Owner', 'Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute'].filter(x => x !== projectPermission) as WorkspaceProjectPermission[])
            ('should throw an error if the request permission is "%s"', async(permission, { expect, ctx }) => {
              const { user } = await ctx.createUser()
              const { workspace } = await ctx.createWorkspace('workspace', true)
              const { project } = await ctx.createProject('project', workspace, true)
              await ctx.assignWorkspace(workspace, user, workspacePermission)
              await ctx.assignProject(project, user, projectPermission)
              const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { user, workspace, name: 'project', permission })
              const error = ctx.ModuleWorkspace.errors.PROJECT_UNAUTHORIZED('workspace', 'project')
              await expect(shouldReject).rejects.toThrowError(error)
            })
          })
        }

        describe<Context>('with user without permission on project', (it) => {
          it('should resolve if the request permission is "Read"', async({ expect, ctx }) => {
            const { user } = await ctx.createUser()
            const { workspace } = await ctx.createWorkspace('workspace', true)
            const { project } = await ctx.createProject('project', workspace, true)
            await ctx.assignWorkspace(workspace, user, workspacePermission)
            const result = await resolveProject.call(ctx.ModuleWorkspace, { user, workspace, name: 'project', permission: 'Read' })
            expect(result).toMatchObject({ id: project.id })
          })

          it.for(['Owner', 'Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute'] as const)
          ('should throw an error if the request permission is "%s"', async(permission, { expect, ctx }) => {
            const { user } = await ctx.createUser()
            const { workspace } = await ctx.createWorkspace('workspace', true)
            await ctx.createProject('project', workspace, true)
            await ctx.assignWorkspace(workspace, user, workspacePermission)
            const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { user, workspace, name: 'project', permission })
            const error = ctx.ModuleWorkspace.errors.PROJECT_UNAUTHORIZED('workspace', 'project')
            await expect(shouldReject).rejects.toThrowError(error)
          })
        })
      })
    }

    describe<Context>('without user', (it) => {
      it('should resolve if the request permission is "Read"', async({ expect, ctx }) => {
        const { workspace } = await ctx.createWorkspace('workspace', true)
        const { project } = await ctx.createProject('project', workspace, true)
        const result = await resolveProject.call(ctx.ModuleWorkspace, { workspace, name: 'project', permission: 'Read' })
        expect(result).toMatchObject({ id: project.id })
      })

      it.for(['Owner', 'Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute'] as const)
      ('should return undefined if the request permission is "%s"', async(permission, { expect, ctx }) => {
        const { workspace } = await ctx.createWorkspace('workspace', true)
        await ctx.createProject('project', workspace, true)
        const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { workspace, name: 'project', permission })
        const error = ctx.ModuleWorkspace.errors.PROJECT_UNAUTHORIZED('workspace', 'project')
        await expect(shouldReject).rejects.toThrowError(error)
      })
    })
  })

  describe<Context>('with private project', () => {
    describe<Context>('with a user with "Owner" permission on workspace', () => {
      for (const projectPermission of ['Owner', 'Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute', 'Read', undefined] as const) {
        describe<Context>(`with a user with "${projectPermission}" permission on project`, (it) => {
          it.for(['Owner', 'Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute', 'Read'] as const)
          ('should resolve if the request permission is "%s"', async(permission, { expect, ctx }) => {
            const { user } = await ctx.createUser()
            const { workspace } = await ctx.createWorkspace('workspace', true)
            const { project } = await ctx.createProject('project', workspace, false)
            await ctx.assignProject(project, user, projectPermission)
            await ctx.assignWorkspace(workspace, user, 'Owner')
            const result = await resolveProject.call(ctx.ModuleWorkspace, { user, workspace, name: 'project', permission })
            expect(result).toMatchObject({ id: project.id })
          })
        })
      }
    })

    for (const workspacePermission of ['Write', 'Read', undefined] as const) {
      describe<Context>(`with a user with "${workspacePermission}" permission on workspace`, () => {

        describe<Context>('with a user with "Owner" permission on project', (it) => {
          it.for(['Owner', 'Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute', 'Read'] as const)
          ('should resolve if the request permission is "%s"', async(permission, { expect, ctx }) => {
            const { user } = await ctx.createUser()
            const { workspace } = await ctx.createWorkspace('workspace', true)
            const { project } = await ctx.createProject('project', workspace, false)
            await ctx.assignProject(project, user, 'Owner')
            await ctx.assignWorkspace(workspace, user, workspacePermission)
            const result = await resolveProject.call(ctx.ModuleWorkspace, { user, workspace, name: 'project', permission })
            expect(result).toMatchObject({ id: project.id })
          })
        })

        for (const projectPermission of ['Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute', 'Read', undefined] as const) {
          describe<Context>(`with a user with "${projectPermission}" permission on project`, (it) => {
            it.for([projectPermission].filter(Boolean) as WorkspaceProjectPermission[])
            ('should resolve if the request permission is "%s"', async(permission, { expect, ctx }) => {
              const { user } = await ctx.createUser()
              const { workspace } = await ctx.createWorkspace('workspace', true)
              const { project } = await ctx.createProject('project', workspace, false)
              await ctx.assignWorkspace(workspace, user, workspacePermission)
              await ctx.assignProject(project, user, projectPermission)
              const result = await resolveProject.call(ctx.ModuleWorkspace, { user, workspace, name: 'project', permission })
              expect(result).toMatchObject({ id: project.id })
            })

            it.for(['Owner', 'Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute'].filter(x => x !== projectPermission) as WorkspaceProjectPermission[])
            ('should throw an error if the request permission is "%s"', async(permission, { expect, ctx }) => {
              const { user } = await ctx.createUser()
              const { workspace } = await ctx.createWorkspace('workspace', true)
              const { project } = await ctx.createProject('project', workspace, false)
              await ctx.assignWorkspace(workspace, user, workspacePermission)
              await ctx.assignProject(project, user, projectPermission)
              const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { user, workspace, name: 'project', permission })
              const error = ctx.ModuleWorkspace.errors.PROJECT_UNAUTHORIZED('workspace', 'project')
              await expect(shouldReject).rejects.toThrowError(error)
            })

            it.for(['Read'].filter(x => x !== projectPermission) as WorkspaceProjectPermission[])
            ('should throw an error if the request permission is "%s"', async(permission, { expect, ctx }) => {
              const { user } = await ctx.createUser()
              const { workspace } = await ctx.createWorkspace('workspace', true)
              const { project } = await ctx.createProject('project', workspace, false)
              await ctx.assignWorkspace(workspace, user, workspacePermission)
              await ctx.assignProject(project, user, projectPermission)
              const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { user, workspace, name: 'project', permission })
              const error = ctx.ModuleWorkspace.errors.PROJECT_NOT_FOUND('workspace', 'project')
              await expect(shouldReject).rejects.toThrowError(error)
            })
          })
        }
      })
    }

    describe<Context>('without user', (it) => {
      it('should throw an error if the request permission is "Read"', async({ expect, ctx }) => {
        const { workspace } = await ctx.createWorkspace('workspace', true)
        await ctx.createProject('project', workspace, false)
        const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { workspace, name: 'project', permission: 'Read' })
        const error = ctx.ModuleWorkspace.errors.PROJECT_NOT_FOUND('workspace', 'project')
        await expect(shouldReject).rejects.toThrowError(error)
      })

      it.for<WorkspaceProjectPermission>(['Owner', 'Write', 'WriteApiKeys', 'WriteSecrets', 'WriteVariables', 'Execute'])
      ('should throw an error if the request permission is "%s"', async(permission, { expect, ctx }) => {
        const { workspace } = await ctx.createWorkspace('workspace', true)
        await ctx.createProject('project', workspace, false)
        const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { workspace, name: 'project', permission })
        const error = ctx.ModuleWorkspace.errors.PROJECT_UNAUTHORIZED('workspace', 'project')
        await expect(shouldReject).rejects.toThrowError(error)
      })
    })
  })

  describe<Context>('edge cases', (it) => {
    it('should throw if the project is not found', async({ expect, ctx }) => {
      const { workspace } = await ctx.createWorkspace('workspace', true)
      const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { name: 'project', workspace, permission: 'Read' })
      const error = ctx.ModuleWorkspace.errors.PROJECT_NOT_FOUND('workspace', 'project')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the workspace does not have a valid "id" property', async({ expect, ctx }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { name: 'project', permission: 'Read', workspace: { id: 'not-an-uuid' } })
      await expect(shouldReject).rejects.toThrow('Expected property "id" to be a UUID but received: not-an-uuid')
    })

    it('should throw if the workspace does not have a "name" property', async({ expect, ctx }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { name: 'project', permission: 'Read', workspace: { id: randomUUID() } })
      await expect(shouldReject).rejects.toThrow('Expected property "name" to be a string but received: undefined')
    })

    it('should throw if the permission is not provided', async({ expect, ctx }) => {
      // @ts-expect-error: testing invalid input
      const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { name: 'project', workspace: { id: 'not-an-uuid' } })
      await expect(shouldReject).rejects.toThrowError('Expected property "id" to be a UUID but received: not-an-uuid')
    })

    it('should throw if the permission is invalid', async({ expect, ctx }) => {
      const { workspace } = await ctx.createWorkspace('workspace', true)
      // @ts-expect-error: testing invalid input
      const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { name: 'project', workspace, permission: 'Invalid' })
      const message = 'Expected property "permission" to be one of the following values: \'Owner\', \'Write\', \'WriteApiKeys\', \'WriteSecrets\', \'WriteVariables\', \'Execute\', \'Read\' but received: Invalid'
      await expect(shouldReject).rejects.toThrow(message)
    })

    it('should throw if no name is provided', async({ expect, ctx }) => {
      const { workspace } = await ctx.createWorkspace('workspace', true)
      // @ts-expect-error: testing invalid input
      const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { workspace, permission: 'Read' })
      await expect(shouldReject).rejects.toThrow('Expected property "name" to be a string but received: undefined')
    })

    it('should throw if the user does not have an "id" property', async({ expect, ctx }) => {
      const { workspace } = await ctx.createWorkspace('workspace', true)
      // @ts-expect-error: testing invalid input
      const shouldReject = resolveProject.call(ctx.ModuleWorkspace, { name: 'project', workspace, permission: 'Read', user: { id: 'not-an-uuid' } })
      await expect(shouldReject).rejects.toThrow('Expected property "user" to match at least one rule chain in the set.')
    })
  })
})
