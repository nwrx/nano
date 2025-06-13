import type { ThreadClientMessage, ThreadServerMessage } from '@nwrx/nano-runner'
import type { ModuleThread } from '..'
import { createWebSocketRoute } from '@unserved/server'
import { assert, assertObjectStrict, createParser } from '@unshared/validation'
import { ModuleFlow } from '../../flow'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { createThread, getThread, getThreadSession } from '../utils'

export function threadSession(this: ModuleThread) {
  return createWebSocketRoute(
    {
      name: 'WS /ws/workspaces/:workspace/projects/:project/flows/:flow/thread/:thread?',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        flow: assert.stringNotEmpty,
        thread: [[assert.undefined], [assert.stringUuid]],
      }),
      parseServerMessage: createParser(assertObjectStrict<ThreadServerMessage>),
      parseClientMessage: createParser(assertObjectStrict<ThreadClientMessage>),
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

        // --- Get the `Thread` entity.
        const thread = parameters.thread
          ? await getThread.call(this, { id: parameters.thread })
          : await createThread.call(this, { user, flow, project, workspace })
        const { Thread } = this.getRepositories()
        await Thread.save(thread)

        // --- Create the thread session instance.
        const session = await getThreadSession.call(this, { thread, flow, project, workspace })
        this.threadSessions.set(peer.id, session)
        session.on('message', message => peer.send(message))
        peer.send({ event: 'ready' })
      },
      onMessage: ({ peer, message }) => {
        const session = this.threadSessions.get(peer.id)
        if (!session) throw this.errors.THREAD_SESSION_NOT_FOUND_FOR_PEER(peer.id)
        session.send(message)
      },
      onClose: async({ peer }) => {
        const session = this.threadSessions.get(peer.id)
        if (!session) return
        await session.close()
      },
      onError: ({ peer, error }) => {
        console.error(error)
        peer.send({ event: 'error', data: [{ name: error.name, message: error.message }] } as ThreadServerMessage)
      },
    },
  )
}
