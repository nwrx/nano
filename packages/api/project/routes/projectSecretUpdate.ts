import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringConstantCase, assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getProject, setProjectSecretValue } from '../utils'

export function projectSecretUpdate(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/:project/secrets/:name',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        name: assertStringConstantCase,
      }),
      parseBody: createSchema({
        value: assertStringNotEmpty,
      }),
    },
    async({ event, body, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project: projectName, name } = parameters
      const { value } = body

      // --- Update the secret for the project.
      const project = await getProject.call(this, {
        user,
        workspace,
        name: projectName,
        permission: 'WriteSecrets',
      })

      const { ProjectSecret } = this.getRepositories()
      const secret = await ProjectSecret.findOneByOrFail({ project, name })
      await setProjectSecretValue(secret, value, {
        secret: this.projectSecretKey,
        algorithm: this.projectSecretCypherAlgorithm,
      })

      // --- Save the secret.
      await ProjectSecret.save(secret)
    },
  )
}
