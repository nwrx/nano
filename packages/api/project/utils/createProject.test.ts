import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
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

  describe<Context>('createProject', (it) => {
    it('should create a project', async({ createUser, moduleProject }) => {
      const { user, workspace } = await createUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace })
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
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace })
      const { Project } = moduleProject.getRepositories()
      const saved = await Project.findOneBy({ id: project.id })
      expect(saved).toMatchObject({ id: project.id })
    })

    it('should create a new private project', async({ createUser, moduleProject }) => {
      const { user, workspace } = await createUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace })
      expect(project).toMatchObject({ isPublic: false })
    })

    it('should create a new public project', async({ createUser, moduleProject }) => {
      const { user, workspace } = await createUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace, isPublic: true })
      expect(project).toMatchObject({ isPublic: true })
    })

    it('should create a project with a title', async({ createUser, moduleProject }) => {
      const { user, workspace } = await createUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', title: 'Project', workspace })
      expect(project.title).toBe('Project')
    })

    it('should default the title to the project name', async({ createUser, moduleProject }) => {
      const { user, workspace } = await createUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace })
      expect(project.title).toBe('project')
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if the project name is taken', async({ createUser, moduleProject, expect }) => {
      const { user, workspace } = await createUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace })
      await moduleProject.getRepositories().Project.save(project)
      const shouldReject = createProject.call(moduleProject, { user, name: 'project', workspace })
      const error = moduleProject.errors.PROJECT_NAME_TAKEN(workspace.name, 'project')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error if the project name is missing', async({ createUser, moduleProject }) => {
      const { user, workspace } = await createUser()
      // @ts-expect-error: testing missing `name` property
      const shouldReject = createProject.call(moduleProject, { user, workspace })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the project user is missing', async({ createUser, moduleProject }) => {
      const { workspace } = await createUser()
      // @ts-expect-error: testing missing `user` property
      const shouldReject = createProject.call(moduleProject, { name: 'project', workspace })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the project workspace is missing', async({ createUser, moduleProject }) => {
      const { user } = await createUser()
      // @ts-expect-error: testing missing `workspace` property
      const shouldReject = createProject.call(moduleProject, { user, name: 'project' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })
  })
})
