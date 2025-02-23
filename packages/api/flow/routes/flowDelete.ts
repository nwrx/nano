import type { ModuleFlow } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'
import { setResponseStatus } from 'h3'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getFlow } from '../utils'

export function flowDelete(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/projects/:project/flows/:name',
      parseParameters: createParser({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        name: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Resolve the workspace and project and assert the user has access to them.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await moduleProject.getProject({ name: parameters.project, workspace, user, permission: 'Write' })
      const flow = await getFlow.call(this, { user, workspace, project, name: parameters.name, permission: 'Owner' })

      // --- Broadcast the flow deletion to the project's peers.
      const observer = moduleProject.observers.get(project.id)
      if (observer) observer.broadcast({ event: 'flowDeleted', name: flow.name })

      // --- Resolve the workspace and project and assert the user has access to them.
      const { Flow } = this.getRepositories()
      await Flow.softRemove(flow)
      setResponseStatus(event, 204)
    },
  )
}
