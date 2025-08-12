import type { Loose } from '@unshared/types'
import type { FindOptionsWhere } from 'typeorm'
import type { ModuleThread } from '..'
import type { Thread } from '../entities'
import { assert, createParser } from '@unshared/validation'
import { assertFlow } from '../../flow'
import { assertProject } from '../../project'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'

/** The schema for the {@linkcode searchThreads} function options. */
export const SEARCH_THREADS_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  workspace: assertWorkspace,
  project: assertProject,
  flow: assertFlow,
  page: [[assert.undefined], [assert.number]],
  limit: [[assert.undefined], [assert.number]],
  withEvents: [[assert.undefined], [assert.boolean]],
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDeleted: [[assert.undefined], [assert.boolean]],
})

/** The options for the {@linkcode searchThreads} function. */
export type SearchThreadsOptions = Loose<ReturnType<typeof SEARCH_THREADS_OPTIONS_SCHEMA>>

/**
 * Search for threads within a specific flow. The function will query the database
 * for threads matching the search criteria and ensure proper access control based on
 * the user's permissions to the parent flow.
 *
 * @param options The options to search threads with.
 * @returns An array of threads matching the search criteria.
 * @example await searchThreads({ flow, project, workspace, user, search: 'test' })
 */
export async function searchThreads(this: ModuleThread, options: SearchThreadsOptions): Promise<Thread[]> {
  const {
    user,
    flow,
    page = 1,
    limit = 10,
    withEvents = false,
    withCreatedBy = false,
    withUpdatedBy = false,
    withDeleted = false,
  } = SEARCH_THREADS_OPTIONS_SCHEMA(options)

  // --- Get the repositories to query the database.
  const { Thread } = this.getRepositories()

  // --- Build the where conditions. Since threads are scoped to a flow,
  // --- we only need to check if the user has access to that specific flow.
  // --- The flow permissions are already validated by the calling route.
  const where: Array<FindOptionsWhere<Thread>> = [
    { flow: { id: flow.id }, createdBy: { id: user.id } },
  ]

  // --- Query the database for threads.
  return await Thread.find({
    where,
    take: limit,
    skip: (page - 1) * limit,
    order: { createdAt: 'DESC' },
    withDeleted,
    relations: {
      events: withEvents,
      createdBy: withCreatedBy,
      updatedBy: withUpdatedBy,
      deletedBy: withDeleted,
    },
  })
}
