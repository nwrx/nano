import type { ThreadServerMessage } from '@nwrx/nano-runner'
import type { ModuleThread } from '..'
import type { Flow } from '../../flow'
import type { Project } from '../../project'
import type { ThreadRunnerChannel } from '../../threadRunner'
import type { Workspace } from '../../workspace'
import type { Thread } from '../entities'
import { ModuleThreadRunner } from '../../threadRunner'
import { ModuleVault } from '../../vault'

export interface ThreadSessionOptions {
  flow: Flow
  thread: Thread
  project: Project
  workspace: Workspace
  onMessage?: (message: ThreadServerMessage) => any
}

export async function getThreadSession(this: ModuleThread, options: ThreadSessionOptions): Promise<ThreadRunnerChannel> {
  const moduleThreadRunner = this.getModule(ModuleThreadRunner)
  const moduleVault = this.getModule(ModuleVault)
  const { onMessage, thread, workspace, project } = options

  // --- Create a new thread session.
  const runner = await moduleThreadRunner.requestThreadRunner()
  await runner.client.requestAttempt('POST /threads/:id', {
    data: {
      id: thread.id,
      flow: thread.data,
    },
  })

  // --- Connect to the thread runner via WebSocket.
  const channel = await runner.client.connect('WS /threads/:id', {
    parameters: { id: thread.id },
    query: { token: runner.token! },
    autoReconnect: true,
    reconnectDelay: 300,
    reconnectLimit: 3,
  }).open()

  // --- Store events in the database.
  const { ThreadEvent } = this.getRepositories()
  channel.on('message', async(message) => {
    if (message.event === 'workerReady') { return }
    else if (message.event === 'workerResolveReference') {
      const [id, type, values] = message.data
      if (type === 'Variables') {
        const [vault, name] = values
        const value = await moduleVault.getVariableValue({ workspace, project, vault, name })
        channel.send({ event: 'workerResolveReferenceResult', data: [{ id, value }] })
      }
    }

    // --- Store the event in the database.
    else {
      const event = ThreadEvent.create({
        thread,
        data: message.data,
        event: message.event,
        runner: runner.runner,
      })
      await ThreadEvent.save(event)

      // --- Custom message handler.
      if (onMessage) onMessage(message as ThreadServerMessage)
    }
  })

  // --- Return the websocket channel.
  return channel
}
