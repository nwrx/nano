import type { Context } from '../../__fixtures__'
import { ValidationError } from '@unshared/validation'
import { createTestContext } from '../../__fixtures__'
import { ERRORS } from './errors'
import { renameProject } from './renameProject'

describe.concurrent<Context>('renameProject', () => {
  beforeEach<Context>(createTestContext)

  describe<Context>('result', (it) => {
    it('should rename a project', async({ setupProject, setupWorkspace, moduleProject }) => {
      const { workspace } = await setupWorkspace()
      const { project } = await setupProject()
      const updatedProject = await renameProject.call(moduleProject, { workspace, project, name: 'new-name' })
      expect(updatedProject).toMatchObject({ id: project.id, name: 'new-name' })
    })

    it('should slugify the project name', async({ setupProject, setupWorkspace, moduleProject }) => {
      const { workspace } = await setupWorkspace()
      const { project } = await setupProject()
      const updatedProject = await renameProject.call(moduleProject, { workspace, project, name: 'New Name' })
      expect(updatedProject.name).toBe('new-name')
    })

    it('should not save the project to the database yet', async({ setupProject, setupWorkspace, moduleProject }) => {
      const { project } = await setupProject()
      const { workspace } = await setupWorkspace()
      await renameProject.call(moduleProject, { project, name: 'new-name', workspace })
      const count = await moduleProject.getRepositories().Project.countBy({ name: 'new-name' })
      expect(count).toBe(0)
    })
  })

  describe<Context>('database', (it) => {
    it('should save the project to the database', async({ setupProject, setupWorkspace, moduleProject }) => {
      const { workspace } = await setupWorkspace()
      const { project } = await setupProject()
      const updatedProject = await renameProject.call(moduleProject, { project, name: 'new-name', workspace })
      await moduleProject.getRepositories().Project.save(updatedProject)
      const count = await moduleProject.getRepositories().Project.countBy({ name: 'new-name' })
      expect(count).toBe(1)
    })
  })

  describe<Context>('validations', (it) => {
    it('should throw an error if the new name is already taken', async({ setupProject, setupWorkspace, moduleProject }) => {
      const { workspace } = await setupWorkspace()
      const { project } = await setupProject()
      await setupProject({ workspace, name: 'new-name' })
      const shouldReject = renameProject.call(moduleProject, { project, name: 'new-name', workspace })
      const error = ERRORS.PROJECT_NAME_TAKEN(workspace.name, 'new-name')
      await expect(shouldReject).rejects.toThrowError(error)
    })

    it('should allow the same name for different workspaces', async({ setupProject, setupWorkspace, moduleProject }) => {
      const { workspace: workspace1 } = await setupWorkspace()
      const { workspace: workspace2 } = await setupWorkspace()
      await setupProject({ workspace: workspace1, name: 'new-name' })
      const { project } = await setupProject()
      const updatedProject = await renameProject.call(moduleProject, { project, name: 'new-name', workspace: workspace2 })
      expect(updatedProject.name).toBe('new-name')
    })
  })

  describe<Context>('errors', (it) => {
    it('should throw an error if the new name is missing', async({ setupProject, setupWorkspace, moduleProject }) => {
      const { workspace } = await setupWorkspace()
      const { project } = await setupProject()
      const shouldReject = renameProject.call(moduleProject, { project, workspace })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the project is missing', async({ setupWorkspace, moduleProject }) => {
      const { workspace } = await setupWorkspace()
      const shouldReject = renameProject.call(moduleProject, { name: 'new-name', workspace })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })

    it('should throw an error if the workspace is missing', async({ setupProject, moduleProject }) => {
      const { project } = await setupProject()
      const shouldReject = renameProject.call(moduleProject, { project, name: 'new-name' })
      await expect(shouldReject).rejects.toThrow(ValidationError)
    })
  })
})
