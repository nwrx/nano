import type { ModuleFlow } from '..'
import { createRoute } from '@unserved/server'
import { assertNotNull, assertNumber, assertStringConstantCase, assertStringNotEmpty, createArrayParser, createAssertStringEquals, createRuleSet, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'

export function flowSession(this: ModuleFlow) {
  return createRoute(
    {
      name: 'WS /ws/workspaces/:workspace/:project/:flow',
      parameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
        flow: assertStringNotEmpty,
      }),
      message: createRuleSet(

        // --- User events.
        [createSchema({
          event: createAssertStringEquals('userJoin'),
          token: assertStringNotEmpty,
        })],
        [createSchema({
          event: createAssertStringEquals('userLeave'),
        })],
        [createSchema({
          event: createAssertStringEquals('userSetPosition'),
          x: assertNumber,
          y: assertNumber,
        })],

        // --- Flow events.
        [createSchema({
          event: createAssertStringEquals('flowSetMetaValue'),
          key: assertStringNotEmpty,
          value: assertNotNull,
        })],
        [createSchema({
          event: createAssertStringEquals('flowRun'),
        })],
        [createSchema({
          event: createAssertStringEquals('flowAbort'),
        })],

        // --- Flow variable events.
        [createSchema({
          event: createAssertStringEquals('flowVariableCreate'),
          name: [assertStringNotEmpty, assertStringConstantCase],
          value: assertStringNotEmpty,
        })],
        [createSchema({
          event: createAssertStringEquals('flowVariableUpdate'),
          name: [assertStringNotEmpty, assertStringConstantCase],
          value: assertStringNotEmpty,
        })],
        [createSchema({
          event: createAssertStringEquals('flowVariableRemove'),
          name: [assertStringNotEmpty, assertStringConstantCase],
        })],

        // --- Flow secret events.
        [createSchema({
          event: createAssertStringEquals('flowSecretCreate'),
          name: [assertStringNotEmpty, assertStringConstantCase],
          value: assertStringNotEmpty,
        })],
        [createSchema({
          event: createAssertStringEquals('flowSecretUpdate'),
          name: [assertStringNotEmpty, assertStringConstantCase],
          value: assertStringNotEmpty,
        })],
        [createSchema({
          event: createAssertStringEquals('flowSecretRemove'),
          name: [assertStringNotEmpty, assertStringConstantCase],
        })],

        // --- Node events.
        [createSchema({
          event: createAssertStringEquals('nodeCreate'),
          kind: assertStringNotEmpty,
          x: assertNumber,
          y: assertNumber,
        })],
        [createSchema({
          event: createAssertStringEquals('nodeDuplicate'),
          nodeId: assertStringNotEmpty,
          x: assertNumber,
          y: assertNumber,
        })],
        [createSchema({
          event: createAssertStringEquals('nodeStart'),
          nodeId: assertStringNotEmpty,
        })],
        [createSchema({
          event: createAssertStringEquals('nodeAbort'),
          nodeId: assertStringNotEmpty,
        })],
        [createSchema({
          event: createAssertStringEquals('nodeSetMetaValue'),
          nodes: createArrayParser({
            nodeId: assertStringNotEmpty,
            key: assertStringNotEmpty,
            value: assertNotNull,
          }),
        })],
        [createSchema({
          event: createAssertStringEquals('nodeSetDataValue'),
          nodeId: assertStringNotEmpty,
          portId: assertStringNotEmpty,
          value: assertNotNull,
        })],
        [createSchema({
          event: createAssertStringEquals('nodesRemove'),
          nodeIds: createArrayParser(assertStringNotEmpty),
        })],

        // --- Link events.
        [createSchema({
          event: createAssertStringEquals('linkCreate'),
          source: assertStringNotEmpty,
          target: assertStringNotEmpty,
        })],
        [createSchema({
          event: createAssertStringEquals('linkRemove'),
          source: assertStringNotEmpty,
        })],
      ),
    },
    {

      /**
       * When a WebSocket connection is opened, the peer information is extracted and
       * used to authenticate the user. Once the user is authenticated, the flow session
       * can be authorized and either created or retrieved from the in-memory set of sessions.
       *
       * @param context The context of the WebSocket connection.
       * @param context.peer The peer that connected to the WebSocket.
       * @param context.parameters The parameters of the WebSocket connection.
       */
      onOpen: async({ peer, parameters }) => {
        try {
          const userModule = this.getModule(ModuleUser)
          const workspaceModule = this.getModule(ModuleWorkspace)
          const { user } = await userModule.authenticate(peer)
          const { workspace: workspaceName, project: projectName, flow: flowName } = parameters

          // --- Resolve the flow and check if the user has access to it.
          const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
          const project = await workspaceModule.resolveProject({ workspace, name: projectName, permission: 'Read' })
          const flow = await this.resolveFlow({ name: flowName, project, workspace })
          if (!flow) throw this.errors.FLOW_NOT_FOUND(workspaceName, projectName, flowName)

          // --- Create or retrieve the flow session and subscribe the peer to it.
          const session = await this.resolveFlowSession(flow)
          session.subscribe(peer, user)
        }

        // --- When an error occurs, send an error message to the client
        // --- so it can be displayed in the UI to the user. This is useful
        // --- for debugging purposes and to inform the user of what went wrong.
        catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          peer.send({ event: 'error', message: `Error while opening WebSocket connection: ${message}` })
        }
      },

      /**
       * When an error occurs, send an error message to the client so it can be displayed
       * in the UI to the user. This is useful for debugging purposes and to inform the user
       * of what went wrong.
       *
       * @param context The context of the WebSocket connection.
       * @param context.peer The peer that connected to the WebSocket.
       * @param context.error The error that occurred.
       */
      onError: ({ peer, error }) => {
        peer.send({ event: 'error', message: error.message })
      },

      /**
       * When a WebSocket connection is closed, the peer information is removed from the
       * flow session and the peer is unsubscribed from it. This ensures that the peer
       * is no longer able to receive updates from the flow session.
       *
       * @param context The context of the WebSocket connection.
       * @param context.peer The peer that connected to the WebSocket.
       */
      onClose: ({ peer }) => {
        const session = this.resolveFlowSessionByPeer(peer)
        if (session) session.unsubscribe(peer)
      },

      /**
       * When a message is received from the client, the message is parsed and the event
       * is triggered on the flow session. The flow session will then handle the event
       * and update the flow accordingly. Once the flow has been updated, the changes
       * are broadcasted to the peers so they can be updated in real-time.
       *
       * @param context The context of the WebSocket connection.
       * @param context.peer The peer that connected to the WebSocket.
       * @param context.message The message that was received from the client.
       * @param context.parameters The parameters of the WebSocket connection
       */
      onMessage: async({ peer, message, parameters }) => {
        const userModule = this.getModule(ModuleUser)
        const workspaceModule = this.getModule(ModuleWorkspace)
        const session = this.resolveFlowSessionByPeer(peer)
        if (!session) return

        // --- User events.
        switch (message.event) {
          case 'userLeave': {
            session.unsubscribe(peer)
            break
          }
          case 'userSetPosition': {
            const { x, y } = message
            session.broadcast({ event: 'user:position', id: peer.id, x, y })
            break
          }

          // --- Flow events.
          case 'flowSetMetaValue': {
            const { key, value } = message
            session.flow.setMetaValue(key, value)
            if (session.flow.meta.name) session.entity.title = session.flow.meta.name
            if (session.flow.meta.description) session.entity.description = session.flow.meta.description
            await session.save()
            break
          }
          case 'flowRun': {
            session.flow.start()
            break
          }
          case 'flowAbort': {
            session.flow.abort()
            break
          }

          // --- Flow variable events.
          case 'flowVariableCreate': {
            const { user } = await userModule.authenticate(peer)
            const { workspace: workspaceName, project: projectName } = parameters

            // --- Resolve the workspace and project and check if the user has access to it.
            const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
            const project = await workspaceModule.resolveProject({ workspace, name: projectName, permission: 'WriteVariables' })

            // --- Create the flow variable and save it to the database.
            const { name, value } = message
            const { WorkspaceProjectVariable } = workspaceModule.getRepositories()
            const variable = await workspaceModule.createProjectVariable({ workspace, project, name, value })
            await WorkspaceProjectVariable.save(variable)

            // --- Update the flow session and broadcast the change to the peers.
            session.flow.variables[name] = value
            session.broadcast({ event: 'variables:create', name, value })
            break
          }
          case 'flowVariableUpdate': {
            const { user } = await userModule.authenticate(peer)
            const { workspace: workspaceName, project: projectName } = parameters

            // --- Resolve the workspace and project and check if the user has access to it.
            const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
            const project = await workspaceModule.resolveProject({ workspace, name: projectName, permission: 'WriteVariables' })

            // --- Update the flow variable and save it to the database.
            const { name, value } = message
            const { WorkspaceProjectVariable } = workspaceModule.getRepositories()
            const variable = await WorkspaceProjectVariable.findOneBy({ project, name })
            if (!variable) throw workspaceModule.errors.PROJECT_VARIABLE_NOT_FOUND(workspaceName, projectName, name)

            // --- Update the flow variable and save it to the database.
            variable.value = value
            await WorkspaceProjectVariable.save(variable)

            // --- Update the flow session and broadcast the change to the peers.
            session.flow.variables[name] = value
            session.broadcast({ event: 'variables:update', name, value })
            break
          }
          case 'flowVariableRemove': {
            const { user } = await userModule.authenticate(peer)
            const { workspace: workspaceName, project: projectName } = parameters

            // --- Resolve the workspace and project and check if the user has access to it.
            const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
            const project = await workspaceModule.resolveProject({ workspace, name: projectName, permission: 'WriteVariables' })

            // --- Find the flow variable to remove.
            const { name } = message
            const { WorkspaceProjectVariable } = workspaceModule.getRepositories()
            const variable = await WorkspaceProjectVariable.findOneBy({ project, name })
            if (!variable) throw workspaceModule.errors.PROJECT_VARIABLE_NOT_FOUND(workspaceName, projectName, name)

            // --- Save the changes to the database and update the flow session.
            await WorkspaceProjectVariable.remove(variable)
            delete session.flow.variables[name]
            session.broadcast({ event: 'variables:remove', name })
            break
          }

          // --- Flow secret events.
          case 'flowSecretCreate': {
            const { user } = await userModule.authenticate(peer)
            const { workspace: workspaceName, project: projectName } = parameters

            // --- Resolve the workspace and project and check if the user has access to it.
            const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
            const project = await workspaceModule.resolveProject({ workspace, name: projectName, permission: 'WriteSecrets' })

            // --- Create the flow secret and save it to the database.
            const { name, value } = message
            const { WorkspaceProjectSecret } = workspaceModule.getRepositories()
            const secret = await workspaceModule.createProjectSecret({ workspace, project, name, value })
            await WorkspaceProjectSecret.save(secret)

            // --- Update the flow session and broadcast the change to the peers.
            session.flow.secrets[name] = value
            session.broadcast({ event: 'secrets:create', name, value })
            break
          }
          case 'flowSecretRemove': {
            const { user } = await userModule.authenticate(peer)
            const { workspace: workspaceName, project: projectName } = parameters

            // --- Resolve the workspace and project and check if the user has access to it.
            const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
            const project = await workspaceModule.resolveProject({ workspace, name: projectName, permission: 'WriteSecrets' })

            // --- Find the flow secret to remove.
            const { name } = message
            const { WorkspaceProjectSecret } = workspaceModule.getRepositories()
            const secret = await WorkspaceProjectSecret.findOneBy({ project, name })
            if (!secret) throw workspaceModule.errors.PROJECT_SECRET_NOT_FOUND(workspaceName, projectName, name)

            // --- Save the changes to the database and update the flow session.
            await WorkspaceProjectSecret.remove(secret)
            delete session.flow.secrets[name]
            session.broadcast({ event: 'secrets:remove', name })
            break
          }

          // --- Node events.
          case 'nodeCreate': {
            const { kind, x, y } = message
            const node = session.flow.nodeCreate(kind, {
              meta: { position: { x, y } },
              initialData: {},
              initialResult: {},
            })
            await node.resolveDataSchema()
            await node.resolveResultSchema()
            await session.save()
            break
          }
          case 'nodeDuplicate': {
            const { nodeId, x, y } = message
            const instance = session.flow.getNodeInstance(nodeId)
            const kind = `${instance.flow.resolveNodeModule(instance).kind}:${instance.node.kind}`
            const node = session.flow.nodeCreate(kind, {
              meta: { position: { x, y } },
              initialData: instance.dataRaw,
            })
            await node.resolveDataSchema()
            await node.resolveResultSchema()
            await session.save()
            break
          }
          case 'nodeStart': {
            const { nodeId } = message
            await session.flow.getNodeInstance(nodeId).process()
            break
          }
          case 'nodeAbort': {
            const { nodeId } = message
            session.flow.getNodeInstance(nodeId).abort()
            break
          }
          case 'nodeSetDataValue': {
            const { nodeId, portId, value } = message
            const node = session.flow.getNodeInstance(nodeId)
            node.setDataValue(portId, value)
            await node.resolveDataSchema()
            await session.save()
            break
          }
          case 'nodeSetMetaValue': {
            for (const { nodeId, key, value } of message.nodes)
              session.flow.getNodeInstance(nodeId).setMetaValue(key, value)
            await session.save()
            break
          }
          case 'nodesRemove': {
            const { nodeIds } = message
            for (const nodeId of nodeIds) {
              session.flow.getNodeInstance(nodeId).abort()
              session.flow.nodeRemove(nodeId)
            }
            await session.save()
            break
          }

          // --- Link events.
          case 'linkCreate': {
            const { source, target } = message
            session.flow.linkCreate(source, target)
            await session.save()
            break
          }
          case 'linkRemove': {
            const { source } = message
            session.flow.linkRemove(source)
            await session.save()
            break
          }
        }
      },
    },
  )
}
