import type { Loose } from '@unshared/types'
import type { ModuleThread } from '..'
import { assert, createParser } from '@unshared/validation'
import { assertFlow } from '../../flow'
import { assertProject } from '../../project'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'

/** The schema for the {@linkcode getThread} function options. */
export const GET_THREAD_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  id: assert.stringUuid,
  flow: assertFlow,
  project: assertProject,
  workspace: assertWorkspace,
  withEvents: [[assert.undefined], [assert.boolean]],
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDeleted: [[assert.undefined], [assert.boolean]],
})

/** The options for the {@linkcode getThread} function. */
export type GetThreadOptions = Loose<ReturnType<typeof GET_THREAD_OPTIONS_SCHEMA>>

/**
 * Get a thread by its ID. This will return the thread object if it exists,
 * otherwise it will throw an error.
 *
 * @param options The options to get the thread.
 * @returns The thread entity if it exists.
 * @example await getThread({ id: 'thread-id', flow, project, workspace })
 */
export async function getThread(this: ModuleThread, options: GetThreadOptions) {
  const {
    user,
    id,
    flow,
    project,
    workspace,
    withEvents = false,
    withCreatedBy = false,
    withUpdatedBy = false,
    withDeleted = false,
  } = GET_THREAD_OPTIONS_SCHEMA(options)

  // --- Get the thread.
  const { Thread } = this.getRepositories()
  const thread = await Thread.findOne({
    where: withDeleted
      ? { id, flow: { id: flow.id }, createdBy: { id: user.id } }
      : { id, flow: { id: flow.id } },
    withDeleted,
    relations: {
      events: withEvents,
      createdBy: withCreatedBy,
      updatedBy: withUpdatedBy,
      deletedBy: withDeleted,
    },
  })

  // --- Return the thread if it exists.
  if (!thread) throw this.errors.THREAD_NOT_FOUND(workspace.name, project.name, flow.name, id)
  return thread
}
