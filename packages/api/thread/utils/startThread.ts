import type { ThreadInputObject } from '@nwrx/nano'
import type { EventBus } from '@unserved/server'
import type { ModuleThread, ThreadEventObject } from '../index'
import { createEventBus } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { assertFlow } from '../../flow'
import { assertProject } from '../../project'
import { ModuleRunner as ModuleRunnerLocal } from '../../runner'
import { ModuleVault } from '../../vault'
import { assertWorkspace } from '../../workspace'
import { assertThread } from './assertThread'

/** The schema for the {@linkcode startThread} function options. */
export const START_THREAD_OPTIONS_SCHEMA = createParser({
  workspace: assertWorkspace,
  project: assertProject,
  flow: assertFlow,
  thread: assertThread,
  inputs: assert.objectStrict<ThreadInputObject>,
})

/** The options for the {@linkcode startThread} function. */
export type StartThreadOptions = ReturnType<typeof START_THREAD_OPTIONS_SCHEMA>

/**
 * Creates a session for a thread and starts it with the provided inputs.
 *
 * @param options The options for creating the thread session
 * @returns An {@linkcode EventBus} instance for the thread session
 * @example await startThread({ workspace, project, thread, flow, inputs })
 */
export async function startThread(this: ModuleThread, options: StartThreadOptions): Promise<EventBus<ThreadEventObject>> {
  const moduleVault = this.getModule(ModuleVault)
  const moduleRunner = this.getModule(ModuleRunnerLocal)
  const { workspace, project, flow, thread, inputs } = START_THREAD_OPTIONS_SCHEMA(options)

  // --- Create the thread session.
  const client = await moduleRunner.requestRunnerClient()
  const channel = client.createThreadSession(thread.id)
  const events: ThreadEventObject[] = []
  let index = 0

  // --- Create an event bus for handling messages.
  const { ThreadEvent } = this.getRepositories()
  const session = createEventBus<ThreadEventObject>({
    onMount: () => {
      void channel.open()
      channel.on('message', async(message) => {

        // --- Store the event in the database.
        const event = ThreadEvent.create({ thread, runner: client.runner, message, index: index++ })
        await ThreadEvent.save(event)
        const serializedEvent = event.serialize()
        await session.sendMessage(serializedEvent)
        events.push(serializedEvent)

        // --- Resolve references.
        if (message.event === 'worker.references.resolve') {
          const [id, type, values] = message.data
          if (type === 'Variables') {
            const [vault, name] = values
            const value = await moduleVault.getVariableValue({ workspace, project, vault, name })
            channel.send({ event: 'worker.references.result', data: { id, value } })
          }
        }

        // --- If the thread was done, close the channel and session.
        if (message.event === 'done') {
          await channel.close()
          await session.close()
          this.sessions.delete(thread.id)
        }
      })

      const stop = channel.on('message', (message) => {
        if (message.event !== 'worker.loaded') return
        channel.send({ event: 'worker.start', data: inputs })
        stop()
      })

      // --- Load the thread.
      channel.on('open', () => {
        channel.send({ event: 'worker.load', data: flow.data })
      })
    },
    onSubscribe: (_, stream) => {
      for (const event of events) void stream.sendMessage(event)
    },
  })

  // --- Store locally for reuse and return the event bus.
  this.sessions.set(thread.id, session)
  return session
}
