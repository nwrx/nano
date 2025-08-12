import type { ModuleThread } from '..'
import { createParser } from '@unshared/validation'
import { assertFlow, ModuleFlow } from '../../flow'
import { assertProject } from '../../project'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'

/** Schema for creating a thread */
export const CREATE_THREAD_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  flow: assertFlow,
  project: assertProject,
  workspace: assertWorkspace,
})

/** Options for creating a thread */
export type CreateThreadOptions = ReturnType<typeof CREATE_THREAD_OPTIONS_SCHEMA>

/**
 * Creates a new thread and saves it to the database.
 *
 * @param options Options for creating the thread.
 * @returns The newly created thread.
 */
export async function createThread(this: ModuleThread, options: CreateThreadOptions) {
  const moduleFlow = this.getModule(ModuleFlow)
  const { user, workspace, project, flow } = CREATE_THREAD_OPTIONS_SCHEMA(options)
  const { Thread } = this.getRepositories()
  const schema = await moduleFlow.getFlowSchema({ workspace, project, flow })
  const thread = Thread.create({ flow, schema, data: flow.data, createdBy: user })
  return await Thread.save(thread)
}
