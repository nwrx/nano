import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertString, assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getProject } from '../utils'

export function projectSetSettings(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/:project',
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
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { project: projectName, workspace } = parameters
      const { title, description } = body

      // --- Resolve the workspace and project and assert the user has access to them.
      const project = await getProject.call(this, {
        user,
        name: projectName,
        workspace,
        permission: 'Write',
      })

      // --- Update and save the project.
      if (title) project.title = title
      if (description) project.description = description
      const { Project } = this.getRepositories()
      await Project.save(project)
    },
  )
}
