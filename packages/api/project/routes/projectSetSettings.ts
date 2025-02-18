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
      const { title, description } = body

      // --- Get the workspace.
      const workspace = await moduleWorkspace.getWorkspace({
        name: parameters.workspace,
        user,
        permission: 'Read',
      })

      // --- Get the project and assert permission.
      const found = await getProject.call(this, {
        user,
        name: parameters.project,
        workspace,
        permission: 'Write',
      })

      // --- Update and save the project.
      if (title) found.title = title
      if (description) found.description = description
      await Project.save(found)
    },
  )
}
