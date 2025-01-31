import type { ModuleProject } from '..'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getProject } from '../utils'

export function projectSecretDelete(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/:project/secrets/:name',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        name: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project: projectName, name } = parameters

      // --- Resolve the workspace and project and check if the user can remove the secret.
      const { ProjectSecret } = this.getRepositories()
      const project = await getProject.call(this, { user, workspace, name: projectName, permission: 'WriteSecrets' })
      const secret = await ProjectSecret.findOneByOrFail({ project, name })

      // --- Unset the value and soft-remove the secret.
      secret.iv = ''
      secret.tag = ''
      secret.cipher = ''
      await this.withTransaction(async() => {
        await ProjectSecret.save(secret)
        await ProjectSecret.softRemove(secret)
      })
    },
  )
}
