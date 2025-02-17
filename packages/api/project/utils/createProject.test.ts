import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { createTestContext } from '../../__fixtures__'
import { Project } from '../entities'
import { createProject } from './createProject'

describe.concurrent<Context>('createProject', () => {
  beforeEach<Context>(async(context) => {
    await createTestContext(context)
  })

  afterEach<Context>(async(context) => {
    await context.application.destroy()
  })

  describe<Context>('with owner access', (it) => {
    it('should create a project', async({ createUser, moduleProject }) => {
      const { user, workspace } = await createUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace: workspace.name })
      expect(project).toBeInstanceOf(Project)
      expect(project).toMatchObject({
        id: project.id,
        name: 'project',
        title: 'project',
        isPublic: false,
        workspace: { id: workspace.id },
        assignments: [{ user: { id: user.id }, permission: 'Owner' }],
      })
    })

    it('should save the project to the database', async({ createUser, moduleProject }) => {
      const { user, workspace } = await createUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace: workspace.name })
      const { Project } = moduleProject.getRepositories()
      const saved = await Project.findOneBy({ id: project.id })
      expect(saved).toMatchObject({ id: project.id })
    })

    it('should create a new private project', async({ createUser, moduleProject }) => {
      const { user, workspace } = await createUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace: workspace.name })
      expect(project).toMatchObject({ isPublic: false })
    })

    it('should create a new public project', async({ createUser, moduleProject }) => {
      const { user, workspace } = await createUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace: workspace.name, isPublic: true })
      expect(project).toMatchObject({ isPublic: true })
    })

    it('should create a project with a title', async({ createUser, moduleProject }) => {
      const { user, workspace } = await createUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', title: 'Project', workspace: workspace.name })
      expect(project.title).toBe('Project')
    })

    it('should default the title to the project name', async({ createUser, moduleProject }) => {
      const { user, workspace } = await createUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace: workspace.name })
      expect(project.title).toBe('project')
    })
  })

  for (const isPublic of [true, false]) {
    describe<Context>(`with ${isPublic ? 'public' : 'private'} project`, (it) => {
      it('should create a project with write access', async({ createUser, createWorkspace, assignWorkspace, moduleProject }) => {
        const { user } = await createUser()
        const { workspace } = await createWorkspace()
        await assignWorkspace(workspace, user, 'Write')
        const project = await createProject.call(moduleProject, { user, name: 'project', workspace: workspace.name })
        expect(project).toBeInstanceOf(Project)
      })

      it('should throw an error if the user does not have write access', async({ createUser, createWorkspace, assignWorkspace, moduleProject, moduleWorkspace }) => {
        const { user } = await createUser()
        const { workspace } = await createWorkspace()
        await assignWorkspace(workspace, user, 'Read')
        const shouldReject = createProject.call(moduleProject, { user, name: 'project', workspace: workspace.name })
        const error = moduleWorkspace.errors.WORKSPACE_ACTION_NOT_AUTHORIZED(workspace.name)
        await expect(shouldReject).rejects.toThrow(error)
      })

      it('should throw an error if the user does not have access to the workspace', async({ createUser, createWorkspace, moduleProject, moduleWorkspace }) => {
        const { user } = await createUser()
        const { workspace } = await createWorkspace()
        const shouldReject = createProject.call(moduleProject, { user, name: 'project', workspace: workspace.name })
        const error = moduleWorkspace.errors.WORKSPACE_ACTION_NOT_AUTHORIZED(workspace.name)
        await expect(shouldReject).rejects.toThrow(error)
      })
    })
  }

  describe<Context>('errors', (it) => {
    it('should throw an error if the project already exists', async({ createUser, moduleProject }) => {
      const { user, workspace } = await createUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace: workspace.name })
      await moduleProject.getRepositories().Project.save(project)
      const shouldReject = createProject.call(moduleProject, { user, name: 'project', workspace: workspace.name })
      const error = moduleProject.errors.PROJECT_NAME_TAKEN(workspace.name, 'project')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error if the project name is empty', async({ moduleProject }) => {
      const user = { id: randomUUID() }
      const shouldReject = createProject.call(moduleProject, { user, name: '', workspace: 'workspace' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the project name is missing', async({ moduleProject }) => {
      const user = { id: randomUUID() }
      // @ts-expect-error: testing missing `name` property
      const shouldReject = createProject.call(moduleProject, { user, workspace: 'workspace' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the project user id is not an UUID', async({ moduleProject, expect }) => {
      // @ts-expect-error: testing invalid `user.id`
      const shouldReject = createProject.call(moduleProject, { user: { id: 'not-a-uuid' }, name: 'project', workspace: 'workspace' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the user id is missing', async({ moduleProject, expect }) => {
      // @ts-expect-error: testing missing `user.id` property
      const shouldReject = createProject.call(moduleProject, { user: {}, name: 'project', workspace: 'workspace' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the workspace name is empty', async({ moduleProject }) => {
      const user = { id: randomUUID() }
      const shouldReject = createProject.call(moduleProject, { user, name: 'project', workspace: '' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })
  })
}, 1000)
