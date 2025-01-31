import type { ModuleFlow } from '..'
import { createRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'

export function flowGet(this: ModuleFlow) {
  return createRoute(
    {
      name: 'GET /api/workspaces/:workspace/:project/:flow',
      parameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        flow: assertStringNotEmpty,
      }),
      query: createSchema({
        withData: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, parameters, query }) => {
      const userModule = this.getModule(ModuleUser)
      const workspaceModule = this.getModule(ModuleWorkspace)
      const { user } = await userModule.authenticate(event)
      const { workspace: workspaceName, project: projectName, flow: flowName } = parameters

      // --- Resolve the flow and check if the user has access to it.
      const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
      const project = await workspaceModule.resolveProject({ workspace, name: projectName, permission: 'Read' })
      const flow = await this.resolveFlowEntity({ name: flowName, project, workspace })

      // --- Return the serialized flow.
      const { withData = false } = query
      return flow.serialize({ withData })
    },
  )
}
