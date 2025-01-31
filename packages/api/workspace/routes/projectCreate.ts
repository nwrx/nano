import type { ModuleWorkspace, WorkspaceProjectObject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertString, assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function projectCreate(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        name: [assertStringNotEmpty, toSlug],
        title: [[assertUndefined], [assertString]],
        description: [[assertUndefined], [assertString]],
      }),
    },
    async({ event, body, parameters }): Promise<WorkspaceProjectObject> => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { name, title, description } = body
      const { workspace: workspaceName } = parameters

      // --- Resolve the workspace to create the project in and assert the user has Write access to it.
      const workspace = await this.resolveWorkspace({ name: workspaceName, user, permission: 'Write' })

      // --- Create and save the project.
      const { WorkspaceProject } = this.getRepositories()
      const project = await this.createProject({ name, title, description, workspace, user })
      await WorkspaceProject.save(project)

      // --- Return the serialized project.
      return project.serialize()
    },
  )
}
