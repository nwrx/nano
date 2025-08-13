import type { ModuleFlowEditor } from '..'
import type { Editor } from '../utils'
import { createWebSocketRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleFlow } from '../../flow'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getEditorSession, MESSAGE_CLIENT_SCHEMA } from '../utils'

export function flowEditor(this: ModuleFlowEditor) {
  return createWebSocketRoute(
    {
      name: 'WS /api/workspaces/:workspace/projects/:project/flows/:flow/editor',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty.withMessage('Workspace name is required.'),
        project: assert.stringNotEmpty.withMessage('Project name is required.'),
        flow: assert.stringNotEmpty.withMessage('Flow name is required.'),
      }),
      parseClientMessage: MESSAGE_CLIENT_SCHEMA,
      parseServerMessage: createParser(assert.objectStrict as (value: unknown) => asserts value is Editor.MessageServer),
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
        const flow = await moduleFlow.getFlow({ name: parameters.flow, workspace, project, user, permission: 'Read' })

        // --- Get the editor session and subscribe the peer.
        const session = getEditorSession.call(this, { flow, user, project, workspace })
        session.subscribe(peer, user)
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
          event: 'editor.error',
          data: {
            name: error instanceof Error ? error.name : 'E_UNKNOWN',
            message: error instanceof Error ? error.message : 'An unknown error occurred.',
          },
        })
      },
    },
  )
}
