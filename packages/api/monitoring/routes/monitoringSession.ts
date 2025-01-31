import type { UUID } from 'node:crypto'
import type { ModuleMonitoring, MonitoringSessionEventPayload } from '../index'
import { createRoute } from '@unserved/server'
import { assert, createRuleSet, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'

export function monitoringSession(this: ModuleMonitoring) {
  return createRoute(
    {
      name: 'WS /ws/workspaces/:workspace/monitoring',
      parameters: createSchema({ workspace: assert.stringNotEmpty }),
      message: createRuleSet(

        /***************************************************************************/
        /* Select                                                                  */
        /***************************************************************************/

        [createSchema({
          event: assert.stringEquals('selectFlow'),
          project: assert.stringNotEmpty,
          name: assert.stringNotEmpty,
        })],

        [createSchema({
          event: assert.stringEquals('selectThread'),
          thread: assert.stringNotEmpty,
        })],

        [createSchema({
          event: assert.stringEquals('selectEvent'),
          id: assert.stringNotEmpty,
        })],

        /***************************************************************************/
        /* Filter                                                                  */
        /***************************************************************************/

        [createSchema({
          event: assert.stringEquals('setProjectFilter'),
          project: assert.stringNotEmpty,
        })],

        [createSchema({
          event: assert.stringEquals('setFlowFilter'),
          flow: assert.stringNotEmpty,
        })],

        [createSchema({
          event: assert.stringEquals('setEventFilter'),
        })],
      ),
    },
    {
      onOpen: async({ peer, parameters }) => {
        const userModule = this.getModule(ModuleUser)
        const workspaceModule = this.getModule(ModuleWorkspace)
        const { user } = await userModule.authenticate(peer)
        const { workspace: name } = parameters

        // --- Assert that the user has write access to the workspace.
        await workspaceModule.resolveWorkspace({ user, name, permission: 'Write' })

        // --- Resolve the flow and check if the user has access to it.
        const { WorkspaceProject } = workspaceModule.getRepositories()
        const projects = await WorkspaceProject.find({
          where: { workspace: { name } },
          relations: { flows: true },
        })

        // --- Return the state.
        peer.send({
          event: 'init',
          projects: projects.map(project => project.serialize()),
          threads: [],
          events: [],
          nodeEvents: [],
        } as MonitoringSessionEventPayload<'init'>)
      },

      onMessage: async({ peer, message, parameters }) => {
        const userModule = this.getModule(ModuleUser)
        const workspaceModule = this.getModule(ModuleWorkspace)
        const { user } = await userModule.authenticate(peer)
        const { workspace: name } = parameters
        const { MonitoringFlowThread } = this.getRepositories()

        try {
          if (message.event === 'selectFlow') {
            const { name: flowName, project: projectName } = message
            const workspace = await workspaceModule.resolveWorkspace({ user, name, permission: 'Write' })
            const project = await workspaceModule.resolveProject({ user, workspace, name: projectName, permission: 'Write' })
            // const flow = await flowModule.resolveFlow({ name: flowName, project, workspace })
            const entities = await MonitoringFlowThread.find({
              where: { flow: { name: flowName, project } },
              relations: { flow: { project: true } },
              order: { createdAt: 'DESC' },
            })
            const threads = entities.map(thread => thread.serialize())
            peer.send({ event: 'threads:update', threads } as MonitoringSessionEventPayload<'threads:update'>)
          }
          else if (message.event === 'selectThread') {
            const { thread } = message
            const entity = await MonitoringFlowThread.findOne({
              where: { id: thread as UUID },
              relations: { events: true, nodeEvents: true },
            })
            if (!entity) throw this.errors.THREAD_NOT_FOUND(thread)
            const events = entity.events?.map(event => event.serialize()) ?? []
            const nodeEvents = entity.nodeEvents?.map(event => event.serialize()) ?? []
            peer.send({ event: 'events:update', events, nodeEvents } as MonitoringSessionEventPayload<'events:update'>)
          }

        }
        catch (error) {
          peer.send({ event: 'error', message: (error as Error).message })
          console.error(error)
        }
      },

      onError: ({ peer, error }) => {
        peer.send({ event: 'error', message: error.message })
      },

      // onClose: ({ peer }) => {
      //   // Handle WebSocket connection close
      // },
    },
  )
}
