import type { Loose } from '@unshared/types'
import type { Runner } from '../entities'
import type { ModuleRunner } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertUser, ModuleUser } from '../../user'
import { assertRunner } from './assertRunner'
import { getRunnerEvents } from './getRunnerEvents'

/** The schema for the update runner options. */
export const UPDATE_RUNNER_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  runner: assertRunner,
  address: assert.stringNotEmpty,
})

/** The options for the update runner function. */
export type UpdateRunnerOptions = Loose<ReturnType<typeof UPDATE_RUNNER_OPTIONS_SCHEMA>>

/**
 * Update an existing runner's configuration. This will update the runner's
 * address in the database and update any existing client connections.
 *
 * @param options The options to update the runner.
 * @returns The updated {@linkcode Runner} entity instance.
 * @example await updateRunner({ user, : 'runner-1', address: 'http://localhost:3001' })
 */
export async function updateRunner(this: ModuleRunner, options: UpdateRunnerOptions): Promise<Runner> {
  const { user, runner, address } = UPDATE_RUNNER_OPTIONS_SCHEMA(options)

  // --- Assert the user is a super administrator.
  const moduleUser = this.getModule(ModuleUser)
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

  // --- If the runner is in use, update the client options.
  const runnerClient = this.clients.get(runner.id)
  if (runnerClient) runnerClient.client.options.baseUrl = address

  // --- Update the runner address in the database.
  const { Runner } = this.getRepositories()
  runner.address = address
  runner.updatedAt = new Date()
  runner.updatedBy = user
  await Runner.save(runner)

  // --- Notify the changes in the event bus.
  const data = Runner.create(runner).serialize({ withCreatedBy: true, withUpdatedBy: true, withDisabledBy: true })
  const events = getRunnerEvents.call(this, { runner, createIfNotExists: true })
  await this.events.sendMessage({ event: 'runners.updated', data })
  if (events) await events.sendMessage({ event: 'runner.updated', data })

  // --- Return the updated runner entity.
  return runner
}
