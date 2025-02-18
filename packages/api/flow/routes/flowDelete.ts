import type { ModuleFlow } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringUuid, createParser } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'

export function flowDelete(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'DELETE /api/flows/:id',
      parseParameters: createParser({
        id: assertStringUuid,
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const workspaceModule = this.getModule(ModuleProject)
      const { Flow } = this.getRepositories()
      const { user } = await userModule.authenticate(event)
      const { id } = parameters

      // --- Find the flow and get it's project and workspace.
      const flow = await Flow.findOne({
        where: { id },
        relations: {
          project: {
            workspace: true,
          },
        },
      })

      // --- Resolve the workspace and project and assert the user has access to them.
      if (!flow) throw this.errors.FLOW_NOT_FOUND_BY_ID(id)
      await workspaceModule.getProject({
        user,
        name: flow.project!.name,
        workspace: flow.project!.workspace!.name,
        permission: 'Write',
      })

      // --- Soft remove the flow.
      await Flow.softRemove(flow)
      setResponseStatus(event, 204)
    },
  )
}
