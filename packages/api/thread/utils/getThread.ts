import type { Loose } from '@unshared/types'
import type { ModuleThread } from '..'
import { assert, createParser } from '@unshared/validation'

export const GET_THREAD_OPTIONS_SCHEMA = createParser({
  id: assert.stringUuid,
  withEvents: [[assert.undefined], [assert.boolean]],
})

export type GetThreadOptions = Loose<ReturnType<typeof GET_THREAD_OPTIONS_SCHEMA>>

export async function getThread(this: ModuleThread, options: GetThreadOptions) {
  const { id, withEvents } = GET_THREAD_OPTIONS_SCHEMA(options)

  // --- Get the thread.
  const { Thread } = this.getRepositories()
  const thread = await Thread.findOne({
    where: { id },
    relations: { events: withEvents },
  })

  // --- Get the thread messages.
  if (!thread) throw this.errors.THREAD_NOT_FOUND(id)
  return thread
}
