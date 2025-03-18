import type { ModuleFlowEditor } from '..'
import { createWebSocketRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { ModuleFlow } from '../../flow'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import {
  EDITOR_SESSION_CLIENT_MESSAGE_SCHEMA,
  EDITOR_SESSION_SERVER_MESSAGE_SCHEMA,
  getEditorSession,
} from '../utils'

export function flowEditor(this: ModuleFlowEditor) {
  return createWebSocketRoute(
    {
      name: 'WS /ws/workspaces/:workspace/projects/:project/flows/:name/editor',
      parseParameters: createSchema({
        workspace: assert.stringNotEmpty.with('Workspace name is required.'),
        project: assert.stringNotEmpty.with('Project name is required.'),
        name: assert.stringNotEmpty.with('Flow name is required.'),
      }),
      parseClientMessage: EDITOR_SESSION_CLIENT_MESSAGE_SCHEMA,
      parseServerMessage: EDITOR_SESSION_SERVER_MESSAGE_SCHEMA,
    },
    {
      onOpen: async({ peer, parameters }) => {
        const moduleUser = this.getModule(ModuleUser)
        const moduleFlow = this.getModule(ModuleFlow)
        const moduleProject = this.getModule(ModuleProject)
        const moduleWorkspace = this.getModule(ModuleWorkspace)
        const { user } = await moduleUser.authenticate(peer)

        // --- Resolve the flow and assert the user has access to it.
        const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
        const project = await moduleProject.getProject({ name: parameters.project, workspace, user, permission: 'Read' })
        const flow = await moduleFlow.getFlow({ name: parameters.name, workspace, project, user, permission: 'Read' })

        // --- Get the editor session and subscribe the peer.
        const session = getEditorSession.call(this, { flow, user, project, workspace })
        await session.subscribe(peer, user)
      },

      onMessage: async({ peer, message }) => {
        const session = getEditorSession.call(this, { peer })
        await session.handleMessage(peer, message)
      },

      onClose: ({ peer }) => {
        const session = getEditorSession.call(this, { peer })
        session.unsubscribe(peer)
      },

      onError: ({ peer, error }) => {
        peer.send({
          event: 'error',
          message: error.message,
        })
      },
    },
  )
}
