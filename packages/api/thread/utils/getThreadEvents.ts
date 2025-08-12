import type { Loose } from '@unshared/types'
import type { ModuleThread } from '..'
import { createParser } from '@unshared/validation'
import { assertFlow } from '../../flow'
import { assertProject } from '../../project'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'
import { assertThread } from './assertThread'

export const GET_THREAD_EVENTS_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  thread: assertThread,
  flow: assertFlow,
  project: assertProject,
  workspace: assertWorkspace,
})

/** The options for the {@linkcode getThreadEvents} function. */
export type GetThreadEventsOptions = Loose<ReturnType<typeof GET_THREAD_EVENTS_OPTIONS_SCHEMA>>

/**
 * Get the events of a thread.
 *
 * @param options The options to get the thread events.
 * @returns The thread events.
 * @example await getThreadEvents({ thread, flow, project, workspace })
 */
export async function getThreadEvents(this: ModuleThread, options: GetThreadEventsOptions) {
  const { thread } = GET_THREAD_EVENTS_OPTIONS_SCHEMA(options)

  // --- Get the thread events.
  const { ThreadEvent } = this.getRepositories()
  const events = await ThreadEvent.find({
    where: { thread: { id: thread.id } },
    order: { index: 'ASC' },
  })

  // --- Return the events.
  return events
}
