import type { ModuleFlow } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'

export function flowDelete(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/:project/:flow',
      parseParameters: createParser({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        flow: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const workspaceModule = this.getModule(ModuleWorkspace)
      const { Flow } = this.getRepositories()
      const { user } = await userModule.authenticate(event)
      const { workspace: workspaceName, project: projectName, flow: flowName } = parameters

      // --- Resolve the workspace and project and assert the user has access to them.
      const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
      const project = await workspaceModule.resolveProject({ user, workspace, name: projectName, permission: 'Write' })

      // --- Find the flow and soft remove it.
      const flow = await Flow.findOneBy({ project, name: flowName })
      if (!flow) throw this.errors.FLOW_NOT_FOUND(workspace.name, project.name, flowName)
      await Flow.softRemove(flow)
    },
  )
}
