import type { Context } from '../../__fixtures__'
import { createContext } from '../../__fixtures__'
import { createProject } from './createProject'

describe.concurrent<Context>('createProject', (it) => {
  beforeEach<Context>(async(context) => {
    context.ctx = await createContext()
  })

  afterEach<Context>(async(context) => {
    await context.ctx.destroy()
  })

  it('should create a new project in the database', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    const project = await createProject.call(ctx.ModuleWorkspace, { user, name: 'project', workspace })
    const { WorkspaceProject } = ctx.ModuleWorkspace.getRepositories()
    await WorkspaceProject.save(project)
    const result = await WorkspaceProject.findOneBy({ name: 'project' })
    expect(result).toMatchObject({ id: project.id, name: 'project' })
  })

  it('should create a new public project in the database', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    const project = await createProject.call(ctx.ModuleWorkspace, { user, name: 'project', workspace, isPublic: true })
    const { WorkspaceProject } = ctx.ModuleWorkspace.getRepositories()
    await WorkspaceProject.save(project)
    const result = await WorkspaceProject.findOneBy({ name: 'project' })
    expect(result).toMatchObject({ id: project.id, name: 'project', isPublic: true })
  })

  it('should default the title to the project name', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    const project = await createProject.call(ctx.ModuleWorkspace, { user, name: 'project', workspace })
    const { WorkspaceProject } = ctx.ModuleWorkspace.getRepositories()
    await WorkspaceProject.save(project)
    const result = await WorkspaceProject.findOneByOrFail({ name: 'project' })
    expect(result.title).toBe('project')
  })

  it('should assign the project to the user with "Owner" permission', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    const project = await createProject.call(ctx.ModuleWorkspace, { user, name: 'project', workspace })
    const { WorkspaceProject, WorkspaceProjectAssignment } = ctx.ModuleWorkspace.getRepositories()
    await WorkspaceProject.save(project)
    const result = await WorkspaceProjectAssignment.findBy({ project: { id: project.id } })
    expect(result).toHaveLength(1)
    expect(result).toMatchObject([{ permission: 'Owner' }])
  })

  it('should throw an error if the project already exists', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    await ctx.createProject('project', workspace)
    const shouldReject = createProject.call(ctx.ModuleWorkspace, { user, name: 'project', workspace })
    const error = ctx.ModuleWorkspace.errors.PROJECT_NAME_TAKEN(workspace.name, 'project')
    await expect(shouldReject).rejects.toThrow(error)
  })

  it('should throw an error if the project name is empty', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    const shouldReject = createProject.call(ctx.ModuleWorkspace, { user, name: '', workspace })
    await expect(shouldReject).rejects.toThrow('Expected property "name" to be a non-empty string but received an empty string.')
  })

  it('should throw an error if the project name is missing', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    const { workspace } = await ctx.createWorkspace()
    // @ts-expect-error: testing missing `name` property
    const shouldReject = createProject.call(ctx.ModuleWorkspace, { user, workspace })
    await expect(shouldReject).rejects.toThrow('Expected property "name" to be a string but received: undefined')
  })

  it('should throw an error if the project user id is not an UUID', async({ expect, ctx }) => {
    const { workspace } = await ctx.createWorkspace()
    // @ts-expect-error: testing invalid `user.id`
    const shouldReject = createProject.call(ctx.ModuleWorkspace, { user: { id: 'not-a-uuid' }, name: 'project', workspace })
    await expect(shouldReject).rejects.toThrow('Expected property "id" to be a UUID but received: not-a-uuid')
  })

  it('should throw an error if the project user id is missing', async({ expect, ctx }) => {
    const { workspace } = await ctx.createWorkspace()
    // @ts-expect-error: testing missing `user.id` property
    const shouldReject = createProject.call(ctx.ModuleWorkspace, { user: {}, name: 'project', workspace })
    await expect(shouldReject).rejects.toThrow('Expected property "id" to be a string but received: undefined')
  })

  it('should throw an error if the project workspace id is not an UUID', async({ expect, ctx }) => {
    const { workspace } = await ctx.createWorkspace()
    // @ts-expect-error: testing invalid `workspace.id`
    const shouldReject = createProject.call(ctx.ModuleWorkspace, { user: { id: 'user' }, name: 'project', workspace })
    await expect(shouldReject).rejects.toThrow('Expected property "id" to be a UUID but received: user')
  })

  it('should throw an error if the project workspace id is missing', async({ expect, ctx }) => {
    const { user } = await ctx.createUser()
    // @ts-expect-error: testing missing `workspace.id` property
    const shouldReject = createProject.call(ctx.ModuleWorkspace, { user, name: 'project', workspace: {} })
    await expect(shouldReject).rejects.toThrow('Expected property "id" to be a string but received: undefined')
  })
})
