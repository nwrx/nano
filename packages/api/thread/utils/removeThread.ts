import type { ModuleThread } from '..'
import { createParser } from '@unshared/validation'
import { assertFlow } from '../../flow'
import { assertProject } from '../../project'
import { assertUser, ModuleUser } from '../../user'
import { assertWorkspace } from '../../workspace'
import { assertThread } from './assertThread'

/** Schema for removing a thread */
export const REMOVE_THREAD_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  flow: assertFlow,
  thread: assertThread,
  project: assertProject,
  workspace: assertWorkspace,
})

/** Options for removing a thread */
export type RemoveThreadOptions = ReturnType<typeof REMOVE_THREAD_OPTIONS_SCHEMA>

/**
 * Removes a thread from the database.
 *
 * @param options Options for removing the thread.
 * @returns The removed thread.
 */
export async function removeThread(this: ModuleThread, options: RemoveThreadOptions): Promise<void> {
  const moduleUser = this.getModule(ModuleUser)
  const { user, thread } = REMOVE_THREAD_OPTIONS_SCHEMA(options)

  // --- Check if the thread was created by the user.
  const { Thread } = this.getRepositories()
  const count = await Thread.countBy({ id: thread.id, createdBy: { id: user.id } })
  if (count === 0) throw moduleUser.errors.USER_FORBIDDEN()

  // --- Check if the thread is currently running in a session. If it is,
  // --- we need to ensure the remote thread is aborted and the session is closed.
  const session = this.sessions.get(thread.id)
  if (session) await session.close()
  this.sessions.delete(thread.id)

  // --- Soft remove the thread from the database.
  thread.deletedBy = user
  thread.deletedAt = new Date()
  await Thread.save(thread)
}
