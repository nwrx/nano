/* eslint-disable unicorn/no-null */
import type { Loose } from '@unshared/types'
import type { ModuleRunner } from '../index'
import { createParser } from '@unshared/validation'
import { assertUser, ModuleUser } from '../../user'
import { assertRunner } from './assertRunner'
import { getRunnerEvents } from './getRunnerEvents'

/** The schema for the enable runner options. */
export const ENABLE_RUNNER_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  runner: assertRunner,
})

/** The options for the enable runner function. */
export type EnableRunnerOptions = Loose<ReturnType<typeof ENABLE_RUNNER_OPTIONS_SCHEMA>>

/**
 * Enable a disabled runner. This will mark the runner as enabled in the
 * database and allow it to accept new thread requests.
 *
 * @param options The options to enable the runner.
 * @returns The enabled {@linkcode Runner} entity instance.
 * @example await enableRunner({ user, runner })
 */
export async function enableRunner(this: ModuleRunner, options: EnableRunnerOptions): Promise<void> {
  const { user, runner } = ENABLE_RUNNER_OPTIONS_SCHEMA(options)

  // --- Assert the user is a super administrator.
  const moduleUser = this.getModule(ModuleUser)
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

  // --- Enable the runner if it is disabled.
  const { Runner } = this.getRepositories()
  if (!runner.disabledAt) throw this.errors.RUNNER_ALREADY_ENABLED(runner.name)
  runner.disabledAt = null
  runner.disabledBy = null
  runner.updatedAt = new Date()
  runner.updatedBy = user
  await Runner.save(runner)

  // --- Notify the changes in the event bus.
  const data = Runner.create(runner).serialize({ withCreatedBy: true, withUpdatedBy: true, withDisabledBy: true })
  const events = getRunnerEvents.call(this, { runner, createIfNotExists: true })
  await this.events.sendMessage({ event: 'runners.updated', data })
  if (events) await events.sendMessage({ event: 'runner.updated', data })
}
