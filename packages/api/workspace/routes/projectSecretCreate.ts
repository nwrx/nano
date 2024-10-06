import type { ModuleWorkspace } from '../index'
import { ModuleUser } from '@nwrx/api'
import { createRoute } from '@unserved/server'
import { assertStringConstantCase, assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'

export function projectSecretCreate(this: ModuleWorkspace) {
  return createRoute(
    {
      name: 'POST /api/workspaces/:workspace/:project/secrets',
      parameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringUuid,
      }),
      body: createSchema({
        name: assertStringConstantCase,
        value: assertStringNotEmpty,
      }),
    },
    async({ event, body, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace: workspaceName, project: projectName } = parameters
      const { name, value } = body

      // --- Resolve the project and assert the user has Write access to it.
      const workspace = await this.resolveWorkspace({ name: workspaceName, user, permission: 'Read' })
      const project = await this.resolveProject({ workspace, name: projectName, permission: 'WriteSecrets' })

      // --- Generate a new secret for the project.
      const { WorkspaceProjectSecret } = this.getRepositories()
      const secret = await this.createProjectSecret({ workspace, project, name, value })
      await WorkspaceProjectSecret.save(secret)
    },
  )
}
