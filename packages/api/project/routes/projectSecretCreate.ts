import type { ModuleProject } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringConstantCase, assertStringNotEmpty, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { getProject, setProjectSecretValue } from '../utils'

export function projectSecretCreate(this: ModuleProject) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/:project/secrets',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
      }),
      parseBody: createSchema({
        name: assertStringConstantCase,
        value: assertStringNotEmpty,
      }),
    },
    async({ event, body, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project: projectName } = parameters
      const { name, value } = body

      // --- Resolve the workspace and project and check if the user can create the secret.
      const { ProjectSecret } = this.getRepositories()
      const project = await getProject.call(this, { user, workspace, name: projectName, permission: 'WriteSecrets' })
      const exists = await ProjectSecret.findOneBy({ project, name })
      if (exists) throw this.errors.PROJECT_SECRET_NAME_TAKEN(workspace, project.name, name)

      // --- Encrypt the secret value.
      const secret = ProjectSecret.create({ createdBy: user })
      await setProjectSecretValue(secret, value, {
        secret: this.projectSecretKey,
        algorithm: this.projectSecretCypherAlgorithm,
      })

      // --- Create and return the secret.
      await ProjectSecret.save(secret)
    },
  )
}
