import type { EventStream } from '@unserved/server'
import type { ThreadEventObject } from '../index'
import type { ModuleThread } from '../index'
import { createEventStream, createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { ModuleFlow } from '../../flow'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getThread, getThreadEvents } from '../utils'

export function threadGetEvents(this: ModuleThread) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/projects/:project/flows/:flow/threads/:thread/events',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        flow: assert.stringNotEmpty,
        thread: assert.stringUuid,
      }),
    },
    async({ event, parameters }): Promise<EventStream<ThreadEventObject>> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleFlow = this.getModule(ModuleFlow)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the thread and its events.
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await moduleProject.getProject({ name: parameters.project, workspace, user, permission: 'Read' })
      const flow = await moduleFlow.getFlow({ name: parameters.flow, workspace, project, user, permission: 'Read' })
      const thread = await getThread.call(this, { id: parameters.thread, workspace, project, flow, user })

      // --- The thread may be running, if so, subscribe to its session.
      const session = this.sessions.get(thread.id)
      if (session) return session.subscribe(event)

      // --- If not, we must return the thread events from the database as a stream.
      const events = await getThreadEvents.call(this, { thread, flow, project, workspace, user })
      const stream = createEventStream<ThreadEventObject>(event)

      // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
      void new Promise<void>(async() => {
        for (const event of events) {
          const serialized = event.serialize()
          await stream.sendMessage(serialized)
        }
        await stream.close()
      })

      return stream
    },
  )
}
