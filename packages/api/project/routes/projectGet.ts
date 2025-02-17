import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getProject } from '../utils'

export function projectGet(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/projects/:project',
      parseParameters: createSchema({
        project: assertStringNotEmpty,
        workspace: assertStringNotEmpty,
      }),
      parseQuery: createSchema({
        withFlows: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withAssignments: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event, { optional: true }) ?? {}
      const { project: projectName, workspace } = parameters

      // --- Get the project and assert the user has access to them.
      const { id } = await getProject.call(this, {
        user,
        name: projectName,
        workspace,
        permission: 'Read',
      })

      // --- Fetch the project from the database.
      const { Project } = this.getRepositories()
      const project = await Project.findOne({
        where: { id },
        relations: {
          flows: query.withFlows,
          assignments: query.withAssignments ? { user: { profile: true } } : false,
        },
        order: {
          name: 'ASC',
        },
      })

      // --- Return the serialized project.
      if (!project) throw this.errors.PROJECT_NOT_FOUND(workspace, projectName)
      return project.serialize()
    },
  )
}
