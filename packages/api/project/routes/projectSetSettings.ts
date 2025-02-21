import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertString, assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getProject } from '../utils'

export function projectSetSettings(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/projects/:project',
      parseParameters: createSchema({
        project: assertStringNotEmpty,
        workspace: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        title: [[assertUndefined], [assertStringNotEmpty]],
        description: [[assertUndefined], [assertString]],
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { Project } = this.getRepositories()
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and project.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await getProject.call(this, { name: parameters.project, workspace, user, permission: 'Write' })

      // --- Update and save the project.
      if (body.title) project.title = body.title
      if (body.description) project.description = body.description
      await Project.save(project)
    },
  )
}
