import type { ModuleWorkspace } from '..'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function projectSecretDelete(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/:project/secrets/:name',
      parseParameters: createSchema({
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
