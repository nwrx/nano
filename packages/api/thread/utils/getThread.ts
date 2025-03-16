import type { ModuleThread } from '..'
import { assert, createSchema } from '@unshared/validation'

export const GET_THREAD_OPTIONS_SCHEMA = createSchema({
  id: assert.stringUuid,
})

export type GetThreadOptions = ReturnType<typeof GET_THREAD_OPTIONS_SCHEMA>

export async function getThread(this: ModuleThread, options: GetThreadOptions) {
  const { id } = GET_THREAD_OPTIONS_SCHEMA(options)

  // --- Get the thread.
  const { Thread } = this.getRepositories()
  const thread = await Thread.findOne({ where: { id } })
  if (!thread) throw this.errors.THREAD_NOT_FOUND(id)
  return thread
}
