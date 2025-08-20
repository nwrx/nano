import type { Loose } from '@unshared/types'
import type { RemoveEvent } from '../../utils'
import type { Runner } from '../entities'
import type { ModuleRunner } from '../index'
import { createParser } from '@unshared/validation'
import { assertUser, ModuleUser } from '../../user'
import { assertRunner } from './assertRunner'
import { getRunnerEvents } from './getRunnerEvents'

/** The schema for the release runner options. */
export const RELEASE_RUNNER_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  runner: assertRunner,
})

/** The options for the release runner function. */
export type ReleaseRunnerOptions = Loose<ReturnType<typeof RELEASE_RUNNER_OPTIONS_SCHEMA>>

/**
 * Release and remove a runner. This will soft-delete the runner from the
 * database and release any existing client connections.
 *
 * @param options The options to release the runner.
 * @returns The released {@linkcode Runner} entity instance.
 * @example await releaseRunner({ user, runner })
 */
export async function releaseRunner(this: ModuleRunner, options: ReleaseRunnerOptions): Promise<Runner> {
  const { user, runner } = RELEASE_RUNNER_OPTIONS_SCHEMA(options)

  // --- Assert the user is a super administrator.
  const moduleUser = this.getModule(ModuleUser)
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

  // --- Soft remove the runner from the database.
  const { Runner } = this.getRepositories()
  runner.deletedAt = new Date()
  runner.deletedBy = user
  await Runner.save(runner)

  // --- Remove the client from the clients map if it exists.
  const client = this.clients.get(runner.id)
  if (client) client.dispose()
  this.clients.delete(runner.id)

  // --- Notify the changes in the event bus.
  const data: RemoveEvent = { name: runner.name, by: user.username }
  await this.events.sendMessage({ event: 'runners.removed', data })
  const events = getRunnerEvents.call(this, { runner, createIfNotExists: true })
  if (events) await events.sendMessage({ event: 'runner.removed', data })

  // --- Return the released runner entity.
  return runner
}
