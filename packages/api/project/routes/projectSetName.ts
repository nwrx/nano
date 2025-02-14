import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getProject } from '../utils'

export function projectSetName(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/:project/name',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        name: [assertStringNotEmpty, toSlug],
      }),
    },
    async({ event, parameters, body }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project: projectName } = parameters
      const { name } = body

      // --- Resolve the workspace and project and assert the user has access to them.
      const project = await getProject.call(this, {
        user,
        name: projectName,
        workspace,
        permission: 'Write',
      })

      // --- Rename the project and save to the database.
      project.name = name
      const { Project } = this.getRepositories()
      await Project.save(project)
    },
  )
}
