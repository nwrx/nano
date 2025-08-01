import type { ModuleFlowEditor } from '..'
import { createWebSocketRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleFlow } from '../../flow'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getEditorSession } from '../utils'
import { MESSAGE_CLIENT_SCHEMA } from '../utils/clientEvent'
import { EDITOR_SESSION_SERVER_MESSAGE_SCHEMA } from '../utils/serverEvent'

export function flowEditor(this: ModuleFlowEditor) {
  return createWebSocketRoute(
    {
      name: 'WS /ws/workspaces/:workspace/projects/:project/flows/:name/editor',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty.withMessage('Workspace name is required.'),
        project: assert.stringNotEmpty.withMessage('Project name is required.'),
        name: assert.stringNotEmpty.withMessage('Flow name is required.'),
      }),
      parseClientMessage: MESSAGE_CLIENT_SCHEMA,
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
