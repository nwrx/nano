import type { ModuleProject } from '..'
import { createWebSocketRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { ModuleFlow } from '../../flow'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getProject, PROJECT_OBSERVER_MESSAGE_SCHEMA, ProjectObserver } from '../utils'

export function flowSubscribe(this: ModuleProject) {
  return createWebSocketRoute(
    {
      name: 'WS /ws/workspaces/:workspace/projects/:project',
      parseParameters: createSchema({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
      }),
      parseServerMessage: PROJECT_OBSERVER_MESSAGE_SCHEMA,
    },
    {
      onOpen: async({ peer, parameters }) => {
        const moduleUser = this.getModule(ModuleUser)
        const moduleFlow = this.getModule(ModuleFlow)
        const moduleWorkspace = this.getModule(ModuleWorkspace)
        const { user } = await moduleUser.authenticate(peer, { optional: true })

        // --- Resolve the workspace and project and assert the user has access to them.
        const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
        const project = await getProject.call(this, { name: parameters.project, workspace, user, permission: 'Read' })
        const flows = await moduleFlow.searchFlow({ project, user, page: 1, limit: 100 })

        // --- Check if the project listener already exists.
        let listener = this.observers.get(project.id)
        if (!listener) {
          listener = new ProjectObserver()
          this.observers.set(project.id, listener)
        }

        // --- Subscribe the peer to the project.
        listener.subscribe(peer)
        listener.send(peer, { event: 'flows', flows: flows.map(flow => flow.serialize()) })
      },
    },
  )
}
