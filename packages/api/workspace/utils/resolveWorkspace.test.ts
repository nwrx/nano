/* eslint-disable no-unexpected-multiline */
import type { Context } from '../../__fixtures__'
import type { WorkspacePermission } from './assertWorkspacePermission'
import { createContext } from '../../__fixtures__'
import { resolveWorkspace } from './resolveWorkspace'

describe.concurrent<Context>('resolveWorkspace', () => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  describe<Context>('with public workspace', () => {
    describe<Context>('without user', (it) => {
      it('should resolve if the request permission is "Read"', async({ expect, ctx }) => {
        const { workspace } = await ctx.createWorkspace('workspace', true)
        const result = await resolveWorkspace.call(ctx.ModuleWorkspace, { name: 'workspace', permission: 'Read' })
        expect(result).toMatchObject({ id: workspace.id })
      })

      it.for(['Write', 'Owner'] as const)
      ('should throw if the request permission is "%s"', async(permission, { expect, ctx }) => {
        await ctx.createWorkspace('workspace', true)
        const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { name: 'workspace', permission })
        const error = ctx.ModuleWorkspace.errors.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
        await expect(shouldReject).rejects.toThrow(error)
      })
    })

    describe<Context>('with user without assignments', (it) => {
      it('should resolve if the request permission is "Read"', async({ expect, ctx }) => {
        const { user } = await ctx.createUser()
        const { workspace } = await ctx.createWorkspace('workspace', true)
        const result = await resolveWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', permission: 'Read' })
        expect(result).toMatchObject({ id: workspace.id })
      })

      it.for(['Write', 'Owner'] as const)
      ('should throw if the request permission is "%s"', async(permission, { expect, ctx }) => {
        const { user } = await ctx.createUser()
        await ctx.createWorkspace('workspace', true)
        const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', permission })
        const error = ctx.ModuleWorkspace.errors.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
        await expect(shouldReject).rejects.toThrow(error)
      })
    })

    describe<Context>('with user with "Read" permission', (it) => {
      it('should resolve if the request permission is "Read"', async({ expect, ctx }) => {
        const { user } = await ctx.createUser()
        const { workspace } = await ctx.createWorkspace('workspace', true)
        await ctx.assignWorkspace(workspace, user, 'Read')
        const result = await resolveWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', permission: 'Read' })
        expect(result).toMatchObject({ id: workspace.id })
      })

      it.for(['Write', 'Owner'] as const)
      ('should throw if the request permission is "%s"', async(permission, { expect, ctx }) => {
        const { user } = await ctx.createUser()
        const { workspace } = await ctx.createWorkspace('workspace', true)
        await ctx.assignWorkspace(workspace, user, 'Read')
        const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', permission })
        const error = ctx.ModuleWorkspace.errors.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
        await expect(shouldReject).rejects.toThrow(error)
      })
    })

    describe<Context>('with user with "Write" permission', (it) => {
      it.for(['Read', 'Write'] as const)
      ('should resolve if the request permission is "%s"', async(permission, { expect, ctx }) => {
        const { user } = await ctx.createUser()
        const { workspace } = await ctx.createWorkspace('workspace', true)
        await ctx.assignWorkspace(workspace, user, 'Write')
        const result = await resolveWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', permission })
        expect(result).toMatchObject({ id: workspace.id })
      })

      it('should throw if the request permission is "Owner"', async({ expect, ctx }) => {
        const { user } = await ctx.createUser()
        const { workspace } = await ctx.createWorkspace('workspace', true)
        await ctx.assignWorkspace(workspace, user, 'Write')
        const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', permission: 'Owner' })
        const error = ctx.ModuleWorkspace.errors.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
        await expect(shouldReject).rejects.toThrow(error)
      })
    })

    describe<Context>('with user with "Owner" permission', (it) => {
      it.for(['Read', 'Write', 'Owner'] as const)
      ('should resolve if the request permission is "%s"', async(permission, { expect, ctx }) => {
        const { user } = await ctx.createUser()
        const { workspace } = await ctx.createWorkspace('workspace', true)
        await ctx.assignWorkspace(workspace, user, 'Owner')
        const result = await resolveWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', permission })
        expect(result).toMatchObject({ id: workspace.id })
      })
    })
  })

  describe<Context>('with private workspace', () => {
    describe<Context>('without user', (it) => {
      it('should throw if the request permission is "Read"', async({ expect, ctx }) => {
        await ctx.createWorkspace('workspace', false)
        const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { name: 'workspace', permission: 'Read' })
        const error = ctx.ModuleWorkspace.errors.WORKSPACE_NOT_FOUND('workspace')
        await expect(shouldReject).rejects.toThrow(error)
      })

      it.for(['Write', 'Owner'] as const)
      ('should throw if the request permission is "%s"', async(permission, { expect, ctx }) => {
        await ctx.createWorkspace('workspace', false)
        const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { name: 'workspace', permission })
        const error = ctx.ModuleWorkspace.errors.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
        await expect(shouldReject).rejects.toThrow(error)
      })
    })

    describe<Context>('with user without assignments', (it) => {
      it('should throw if the request permission is "Read"', async({ expect, ctx }) => {
        await ctx.createWorkspace('workspace', false)
        const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { name: 'workspace', permission: 'Read' })
        const error = ctx.ModuleWorkspace.errors.WORKSPACE_NOT_FOUND('workspace')
        await expect(shouldReject).rejects.toThrow(error)
      })

      it.for(['Write', 'Owner'] as const)
      ('should throw if the request permission is "%s"', async(permission, { expect, ctx }) => {
        await ctx.createWorkspace('workspace', false)
        const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { name: 'workspace', permission })
        const error = ctx.ModuleWorkspace.errors.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
        await expect(shouldReject).rejects.toThrow(error)
      })
    })

    describe<Context>('with user with "Read" permission', (it) => {
      it('should resolve if the request permission is "Read"', async({ expect, ctx }) => {
        const { user } = await ctx.createUser()
        const { workspace } = await ctx.createWorkspace('workspace', false)
        await ctx.assignWorkspace(workspace, user, 'Read')
        const result = await resolveWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', permission: 'Read' })
        expect(result).toMatchObject({ id: workspace.id })
      })

      it.for(['Write', 'Owner'] as const)
      ('should throw if the request permission is "%s"', async(permission, { expect, ctx }) => {
        const { user } = await ctx.createUser()
        const { workspace } = await ctx.createWorkspace('workspace', false)
        await ctx.assignWorkspace(workspace, user, 'Read')
        const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', permission })
        const error = ctx.ModuleWorkspace.errors.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
        await expect(shouldReject).rejects.toThrow(error)
      })
    })

    describe<Context>('with user with "Write" permission', (it) => {
      it('should resolve if the request permission is "Write"', async({ expect, ctx }) => {
        const { user } = await ctx.createUser()
        const { workspace } = await ctx.createWorkspace('workspace', false)
        await ctx.assignWorkspace(workspace, user, 'Write')
        const result = await resolveWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', permission: 'Write' })
        expect(result).toMatchObject({ id: workspace.id })
      })

      it('should throw if the request permission is "Read"', async({ expect, ctx }) => {
        const { user } = await ctx.createUser()
        const { workspace } = await ctx.createWorkspace('workspace', false)
        await ctx.assignWorkspace(workspace, user, 'Write')
        const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', permission: 'Read' })
        const error = ctx.ModuleWorkspace.errors.WORKSPACE_NOT_FOUND('workspace')
        await expect(shouldReject).rejects.toThrow(error)
      })

      it('should throw if the request permission is "Owner"', async({ expect, ctx }) => {
        const { user } = await ctx.createUser()
        const { workspace } = await ctx.createWorkspace('workspace', false)
        await ctx.assignWorkspace(workspace, user, 'Write')
        const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', permission: 'Owner' })
        const error = ctx.ModuleWorkspace.errors.WORKSPACE_ACTION_NOT_AUTHORIZED('workspace')
        await expect(shouldReject).rejects.toThrow(error)
      })
    })

    describe<Context>('with user with "Owner" permission', (it) => {
      it.for(['Read', 'Write', 'Owner'] as const)
      ('should resolve if the request permission is "%s"', async(permission, { expect, ctx }) => {
        const { user } = await ctx.createUser()
        const { workspace } = await ctx.createWorkspace('workspace', false)
        await ctx.assignWorkspace(workspace, user, 'Owner')
        const result = await resolveWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', permission })
        expect(result).toMatchObject({ id: workspace.id })
      })
    })
  })

  describe<Context>('edge cases', (it) => {
    it('should throw if the workspace is not found', async({ expect, ctx }) => {
      const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { name: 'workspace', permission: 'Read' })
      const error = ctx.ModuleWorkspace.errors.WORKSPACE_NOT_FOUND('workspace')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw if the permission is not provided', async({ expect, ctx }) => {
      await ctx.createWorkspace('workspace', true)
      const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { name: 'workspace' } as any)
      const message = 'Expected property "permission" to be a string but received: undefined'
      await expect(shouldReject).rejects.toThrow(message)
    })

    it('should throw if the permission is invalid', async({ expect, ctx }) => {
      await ctx.createWorkspace('workspace', true)
      const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { name: 'workspace', permission: 'Invalid' as WorkspacePermission })
      const message = 'Expected property "permission" to be one of the following values: \'Owner\', \'Write\', \'Read\' but received: Invalid'
      await expect(shouldReject).rejects.toThrow(message)
    })

    it('should throw if no name is provided', async({ expect, ctx }) => {
      await ctx.createWorkspace('workspace', true)
      const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { permission: 'Read' } as any)
      const message = 'Expected property "name" to be a string but received: undefined'
      await expect(shouldReject).rejects.toThrow(message)
    })

    it('should throw if the user does not have an "id" property', async({ expect, ctx }) => {
      await ctx.createWorkspace('workspace', true)
      // @ts-expect-error: testing invalid input.
      const shouldReject = resolveWorkspace.call(ctx.ModuleWorkspace, { user: { id: 'not-an-uuid' }, name: 'workspace', permission: 'Read' })
      const message = 'Expected property "user" to match at least one rule chain in the set.'
      await expect(shouldReject).rejects.toThrow(message)
    })
  })
})
