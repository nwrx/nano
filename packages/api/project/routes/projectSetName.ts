import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getProject } from '../utils'

export function projectSetName(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/projects/:project/name',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        name: [assertStringNotEmpty, toSlug],
      }),
    },
    async({ event, parameters, body }): Promise<void> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const { name } = body

      // --- Get the workspace.
      const workspace = await moduleWorkspace.getWorkspace({
        name: parameters.workspace,
        user,
        permission: 'Read',
      })

      // --- Get the project and assert permission.
      const project = await getProject.call(this, {
        workspace,
        user: { id: user.id },
        name: parameters.project,
        permission: 'Owner',
      })

      // --- Rename the project and save to the database.
      project.name = name
      const { Project } = this.getRepositories()
      await Project.save(project)
    },
  )
}
