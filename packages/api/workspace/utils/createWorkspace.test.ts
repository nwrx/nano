import type { Context } from '../../__fixtures__'
import { createContext } from '../../__fixtures__'
import { createWorkspace } from './createWorkspace'

describe.concurrent<Context>('createWorkspace', (it) => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  it('should create a new workspace in the database', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const workspace = await createWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace' })
    const { Workspace } = ctx.ModuleWorkspace.getRepositories()
    const result = await Workspace.findOneBy({ name: 'workspace' })
    expect(result).toMatchObject({ id: workspace.id, name: 'workspace', isPublic: false })
  })

  it('should create a new public workspace in the database', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { Workspace } = ctx.ModuleWorkspace.getRepositories()
    const workspace = await createWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace', isPublic: true })
    const result = await Workspace.findOneBy({ name: 'workspace' })
    expect(result).toMatchObject({ id: workspace.id, name: 'workspace', isPublic: true })
  })

  it('should assign the workspace to the user with full access', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { WorkspaceAssignment } = ctx.ModuleWorkspace.getRepositories()
    const workspace = await createWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace' })
    const result = await WorkspaceAssignment.findBy({ workspace: { id: workspace.id } })
    expect(result).toHaveLength(1)
    expect(result).toMatchObject([{ permission: 'Owner' }])
  })

  it('should throw an error if the workspace already exists', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    await createWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace' })
    const shouldReject = createWorkspace.call(ctx.ModuleWorkspace, { user, name: 'workspace' })
    const error = ctx.ModuleWorkspace.errors.WORKSPACE_NAME_TAKEN('workspace')
    await expect(shouldReject).rejects.toThrow(error)
  })

  it('should throw an error if the workspace name is empty', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const shouldReject = createWorkspace.call(ctx.ModuleWorkspace, { user, name: '' })
    await expect(shouldReject).rejects.toThrow('Expected property "name" to be a non-empty string but received an empty string.')
  })

  it('should throw an error if the workspace name is missing', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    // @ts-expect-error: testing missing `name` property
    const shouldReject = createWorkspace.call(ctx.ModuleWorkspace, { user })
    await expect(shouldReject).rejects.toThrow('Expected property "name" to be a string but received: undefined')
  })

  it('should throw an error if the workspace user id is not an UUID', async({ expect, ctx }) => {
    // @ts-expect-error: testing invalid `user.id`
    const shouldReject = createWorkspace.call(ctx.ModuleWorkspace, { user: { id: 'not-a-uuid' }, name: 'workspace' })
    await expect(shouldReject).rejects.toThrow('Expected property "id" to be a UUID but received: not-a-uuid')
  })

  it('should throw an error if the workspace user id is missing', async({ expect, ctx }) => {
    // @ts-expect-error: testing missing `user.id` property
    const shouldReject = createWorkspace.call(ctx.ModuleWorkspace, { user: {}, name: 'workspace' })
    await expect(shouldReject).rejects.toThrow('Expected property "id" to be a string but received: undefined')
  })

  it('should throw an error if the workspace user is missing', async({ expect, ctx }) => {
    // @ts-expect-error: testing missing `user.id` property
    const shouldReject = createWorkspace.call(ctx.ModuleWorkspace, { name: 'workspace' })
    await expect(shouldReject).rejects.toThrow('Cannot read properties of undefined (reading \'id\')')
  })
})
