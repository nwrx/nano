import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getProject } from '../utils'

export function projectDelete(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/:name',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        name: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }): Promise<void> => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { name, workspace } = parameters

      // --- Get the project and remove it. Make sure the user is an owner of the project.
      const project = await getProject.call(this, { user, name, workspace, permission: 'Owner' })
      const { Project } = this.getRepositories()
      await Project.softRemove(project)
    },
  )
}
