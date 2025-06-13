import type { Context } from '../../__fixtures__'
import { AssertionError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { Project } from '../entities'
import { createProject } from './createProject'

describe.concurrent<Context>('createProject', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('result', (it) => {
    it('should create a project', async({ setupUser, moduleProject }) => {
      const { user, workspace } = await setupUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace })
      expect(project).toBeInstanceOf(Project)
      expect(project).toMatchObject({
        id: project.id,
        name: 'project',
        title: 'project',
        isPublic: false,
        workspace: { id: workspace.id },
        createdBy: { id: user.id },
        assignments: [{ user: { id: user.id }, permission: 'Owner' }],
      })
    })

    it('should create a project with a title', async({ setupUser, moduleProject }) => {
      const { user, workspace } = await setupUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', title: 'Project', workspace })
      expect(project).toMatchObject({ title: 'Project' })
    })

    it('should create a new private project', async({ setupUser, moduleProject }) => {
      const { user, workspace } = await setupUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace })
      expect(project).toMatchObject({ isPublic: false })
    })

    it('should create a new public project', async({ setupUser, moduleProject }) => {
      const { user, workspace } = await setupUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace, isPublic: true })
      expect(project).toMatchObject({ isPublic: true })
    })

    it('should not save the project to the database yet', async({ setupUser, moduleProject }) => {
      const { user, workspace } = await setupUser()
      await createProject.call(moduleProject, { user, name: 'project', workspace })
      const count = await moduleProject.getRepositories().Project.countBy({ name: 'project' })
      expect(count).toBe(0)
    })
  })

  describe<Context>('database', (it) => {
    it('should save the project to the database', async({ setupUser, moduleProject }) => {
      const { user, workspace } = await setupUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace })
      await moduleProject.getRepositories().Project.save(project)
      const count = await moduleProject.getRepositories().Project.countBy({ name: 'project' })
      expect(count).toBe(1)
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if the project name is taken', async({ setupUser, moduleProject, expect }) => {
      const { user, workspace } = await setupUser()
      const project = await createProject.call(moduleProject, { user, name: 'project', workspace })
      await moduleProject.getRepositories().Project.save(project)
      const shouldReject = createProject.call(moduleProject, { user, name: 'project', workspace })
      const error = moduleProject.errors.PROJECT_NAME_TAKEN(workspace.name, 'project')
      await expect(shouldReject).rejects.toThrow(error)
    })

    it('should throw an error if the project name is missing', async({ setupUser, moduleProject }) => {
      const { user, workspace } = await setupUser()
      // @ts-expect-error: testing missing `name` property
      const shouldReject = createProject.call(moduleProject, { user, workspace })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw an error if the project user is missing', async({ setupUser, moduleProject }) => {
      const { workspace } = await setupUser()
      // @ts-expect-error: testing missing `user` property
      const shouldReject = createProject.call(moduleProject, { name: 'project', workspace })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })

    it('should throw an error if the project workspace is missing', async({ setupUser, moduleProject }) => {
      const { user } = await setupUser()
      // @ts-expect-error: testing missing `workspace` property
      const shouldReject = createProject.call(moduleProject, { user, name: 'project' })
      await expect(shouldReject).rejects.toThrow(AssertionError)
    })
  })
})
