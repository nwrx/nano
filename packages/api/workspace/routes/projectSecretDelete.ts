import type { ModuleWorkspace } from '..'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function projectSecretDelete(this: ModuleWorkspace) {
  return createRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/:project/secrets/:secret',
      parameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringUuid,
        secret: assertStringUuid,
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace: workspaceName, project: projectName, secret: secretName } = parameters

      // --- Resolve the project and assert the user has Write access to it.
      const workspace = await this.resolveWorkspace({ name: workspaceName, user, permission: 'Read' })
      const project = await this.resolveProject({ workspace, name: projectName, permission: 'WriteSecrets' })

      // --- Fetch and delete the secret.
      const { WorkspaceProjectSecret } = this.getRepositories()
      const secret = await WorkspaceProjectSecret.findOneBy({ project, name: secretName })
      if (!secret) throw this.errors.PROJECT_SECRET_NOT_FOUND(workspace.name, project.name, secretName)

      // --- Clear the value and options from the secret.
      await this.withTransaction(async() => {
        secret.cipher = ''
        secret.options = { algorithm: '', iv: '' }
        await WorkspaceProjectSecret.save(secret)
        await WorkspaceProjectSecret.softRemove(secret)
      })
    },
  )
}
