import type { ModuleThread } from '..'
import { createSchema } from '@unshared/validation'
import { assertFlow } from '../../flow'
import { assertProject } from '../../project'
import { assertUser } from '../../user'
import { assertWorkspace } from '../../workspace'

export const CREATE_THREAD_OPTIONS_SCHEMA = createSchema({
  user: assertUser,
  flow: assertFlow,
  project: assertProject,
  workspace: assertWorkspace,
})

export type CreateThreadOptions = ReturnType<typeof CREATE_THREAD_OPTIONS_SCHEMA>

export async function createThread(this: ModuleThread, options: CreateThreadOptions) {
  const { user, flow } = CREATE_THREAD_OPTIONS_SCHEMA(options)

  // --- Check if there is a thread that has no events and the same data.
  const { Thread } = this.getRepositories()
  const existing = await Thread.find({
    where: { flow, data: flow.data },
    relations: { events: true },
  })

  // --- Return the first thread that has no events.
  for (const thread of existing) {
    if (thread.events!.length > 0) continue
    return thread
  }

  // --- Create the thread.
  const thread = Thread.create({ flow, data: flow.data, createdBy: user })
  return thread
}
