import type { ModuleProject, ProjectObject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertString, assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { createProject } from '../utils'

export function projectCreate(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/projects',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        name: [assertStringNotEmpty, toSlug],
        title: [[assertUndefined], [assertString]],
        description: [[assertUndefined], [assertString]],
      }),
    },
    async({ event, parameters, body }): Promise<ProjectObject> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const { name, title, description } = body

      // --- Get the workspace and create the project.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Write' })
      const project = await createProject.call(this, { name, title, description, workspace, user })
      return project.serialize()
    },
  )
}
