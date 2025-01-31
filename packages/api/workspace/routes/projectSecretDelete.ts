import type { ModuleWorkspace } from '..'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function projectSecretDelete(this: ModuleWorkspace) {
  return createRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/:project/secrets/:name',
      parameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringUuid,
        name: assertStringUuid,
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project, name } = parameters
      await this.deleteProjectSecret({ workspace, project, name, user })
    },
  )
}
