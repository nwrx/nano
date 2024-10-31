import type { ModuleFlow } from '..'
import { ModuleUser } from '@nwrx/api/user'
import { ModuleWorkspace } from '@nwrx/api/workspace'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, createSchema } from '@unshared/validation'
import { setResponseHeader } from 'h3'
import * as YAML from 'yaml'

export function flowExport(this: ModuleFlow) {
  return createRoute(
    {
      name: 'GET /api/workspaces/:workspace/:project/:flow/export',
      parameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        flow: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const workspaceModule = this.getModule(ModuleWorkspace)
      const { user } = await userModule.authenticate(event)
      const { workspace: workspaceName, project: projectName, flow: flowName } = parameters

      // --- Resolve the flow and check if the user has access to it.
      const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
      const project = await workspaceModule.resolveProject({ workspace, name: projectName, permission: 'Read' })
      const flow = await this.resolveFlowEntity({ name: flowName, project, workspace })

      // --- Return the serialized flow.
      const data = YAML.stringify(flow.data)
      setResponseHeader(event, 'Content-Type', 'application/yaml')
      setResponseHeader(event, 'Content-Disposition', `attachment; filename="${flowName}.yaml"`)
      return data
    },
  )
}
