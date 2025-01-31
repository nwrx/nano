import type { ModuleWorkspace } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function projectSecretCreate(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/:project/secrets',
      parseParameters: createSchema({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
      }),
      parseBody: createSchema({
        name: assert.stringConstantCase.with('The name of the secret must be in constant case.'),
        value: assert.stringNotEmpty.with('The value of the secret must not be a non-empty string.'),
      }),
    },
    async({ event, body, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project } = parameters
      const { name, value } = body

      // --- Generate a new secret for the project.
      const { WorkspaceProjectSecret } = this.getRepositories()
      const secret = await this.createProjectSecret({ workspace, project, name, value, user })
      await WorkspaceProjectSecret.save(secret)
    },
  )
}
