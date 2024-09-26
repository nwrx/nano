/* eslint-disable no-unexpected-multiline */
import type { Context } from '../../__fixtures__'
import { randomUUID } from 'node:crypto'
import { ModuleWorkspace } from '..'
import { createContext } from '../../__fixtures__'
import { assignWorkspace } from './assignWorkspace'

describe.concurrent<Context>('assignWorkspace', (it) => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  it.for(['Owner', 'Write', 'Read'] as const)
  ('should assign the user to the workspace with the "%s" permission', async(permission, { expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    const assignment = await assignWorkspace.call(ctx.ModuleWorkspace, { user, workspace, permission })
    const { WorkspaceAssignment } = ctx.ModuleWorkspace.getRepositories()
    const result = await WorkspaceAssignment.findOneBy({ user, workspace: { id: workspace.id }, permission })
    expect(result).toMatchObject({ id: assignment.id, permission })
  })

  it('should create a "Read" assignment if the user does not have it', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    await assignWorkspace.call(ctx.ModuleWorkspace, { user, workspace, permission: 'Write' })
    const { WorkspaceAssignment } = ctx.ModuleWorkspace.getRepositories()
    const result = await WorkspaceAssignment.findBy({ user, workspace: { id: workspace.id } })
    expect(result).toMatchObject([
      { permission: 'Read' },
      { permission: 'Write' },
    ])
  })

  it('should throw an error if the user is already assigned to the workspace', async({ expect, ctx }) => {
    const module = ctx.application.getModule(ModuleWorkspace)
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    await ctx.assignWorkspace(workspace, user, 'Owner')
    const shouldReject = assignWorkspace.call(module, { user, workspace, permission: 'Owner' })
    const error = module.errors.WORKSPACE_ALREADY_ASSIGNED(user.username, workspace.name, 'Owner')
    await expect(shouldReject).rejects.toThrowError(error)
  })

  it('should throw an error if the user does not have a valid permission', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    // @ts-expect-error: testing invalid input
    const shouldReject = assignWorkspace.call(ctx.ModuleWorkspace, { user, workspace, permission: 'Invalid' })
    const message = 'Expected property "permission" to be one of the following values: \'Owner\', \'Write\', \'Read\' but received: Invalid'
    await expect(shouldReject).rejects.toThrowError(message)
  })

  it('should throw an error if the workspace id is not an UUID', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    // @ts-expect-error: testing invalid input
    const shouldReject = assignWorkspace.call(ctx.ModuleWorkspace, { user, workspace: { id: 'invalid', name: workspace.name }, permission: 'Owner' })
    await expect(shouldReject).rejects.toThrowError('Expected property "id" to be a UUID but received: invalid')
  })

  it('should throw an error if the workspace name is empty', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    const shouldReject = assignWorkspace.call(ctx.ModuleWorkspace, { user, workspace: { id: workspace.id, name: '' }, permission: 'Owner' })
    await expect(shouldReject).rejects.toThrowError('Expected property "name" to be a non-empty string but received an empty string.')
  })

  it('should throw an error if the workspace name is missing', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    // @ts-expect-error: testing missing `name` property
    const shouldReject = assignWorkspace.call(ctx.ModuleWorkspace, { user, workspace: { id: workspace.id }, permission: 'Owner' })
    await expect(shouldReject).rejects.toThrowError('Expected property "name" to be a string but received: undefined')
  })

  it('should throw an error if the user id is not an UUID', async({ expect, ctx }) => {
    const { workspace } = await ctx.createWorkspace()
    // @ts-expect-error: testing invalid `user.id`
    const shouldReject = assignWorkspace.call(ctx.ModuleWorkspace, { user: { id: 'invalid', username: 'user' }, workspace, permission: 'Owner' })
    await expect(shouldReject).rejects.toThrowError('Expected property "id" to be a UUID but received: invalid')
  })

  it('should throw an error if the user username is empty', async({ expect, ctx }) => {
    const { workspace } = await ctx.createWorkspace()
    const shouldReject = assignWorkspace.call(ctx.ModuleWorkspace, { user: { id: randomUUID(), username: '' }, workspace, permission: 'Owner' })
    await expect(shouldReject).rejects.toThrowError('Expected property "username" to be a non-empty string but received an empty string.')
  })
})
