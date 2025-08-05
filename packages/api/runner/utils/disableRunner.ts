import type { Loose } from '@unshared/types'
import type { ModuleRunner } from '../index'
import { createParser } from '@unshared/validation'
import { assertUser, ModuleUser } from '../../user'
import { assertRunner } from './assertRunner'
import { getRunnerEvents } from './getRunnerEvents'

/** The schema for the disable runner options. */
export const DISABLE_RUNNER_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  runner: assertRunner,
})

/** The options for the disable runner function. */
export type DisableRunnerOptions = Loose<ReturnType<typeof DISABLE_RUNNER_OPTIONS_SCHEMA>>

/**
 * Disable an existing runner. This will mark the runner as disabled in the
 * database and prevent it from accepting new thread requests.
 *
 * @param options The options to disable the runner.
 * @returns The disabled {@linkcode Runner} entity instance.
 * @example await disableRunner({ user, runner })
 */
export async function disableRunner(this: ModuleRunner, options: DisableRunnerOptions): Promise<void> {
  const { user, runner } = DISABLE_RUNNER_OPTIONS_SCHEMA(options)

  // --- Assert the user is a super administrator.
  const moduleUser = this.getModule(ModuleUser)
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

  // --- Disable the runner if it is enabled.
  if (runner.disabledAt) throw this.errors.RUNNER_ALREADY_DISABLED(runner.name)
  const { Runner } = this.getRepositories()
  runner.disabledAt = new Date()
  runner.disabledBy = user
  runner.updatedAt = new Date()
  runner.updatedBy = user
  await Runner.save(runner)

  // --- Notify the changes in the event bus.
  const data = Runner.create(runner).serialize({ withCreatedBy: true, withUpdatedBy: true, withDisabledBy: true })
  const events = getRunnerEvents.call(this, { runner, createIfNotExists: true })
  await this.events.sendMessage({ event: 'runners.updated', data })
  if (events) await events.sendMessage({ event: 'runner.updated', data })
}
