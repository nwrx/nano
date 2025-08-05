import type { Loose } from '@unshared/types'
import type { RenameEvent } from '../../utils'
import type { Runner } from '../entities'
import type { ModuleRunner } from '../index'
import { toSlug } from '@unshared/string/toSlug'
import { assert, createParser } from '@unshared/validation'
import { assertUser, ModuleUser } from '../../user'
import { assertRunner } from './assertRunner'
import { getRunnerEvents } from './getRunnerEvents'

/** The schema for the rename runner options. */
export const RENAME_RUNNER_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  runner: assertRunner,
  name: [assert.stringNotEmpty, toSlug],
})

/** The options for the rename runner function. */
export type RenameRunnerOptions = Loose<ReturnType<typeof RENAME_RUNNER_OPTIONS_SCHEMA>>

/**
 * Rename a runner by changing its name. This will update the runner's
 * name in the database after checking that the new  is not already taken.
 *
 * @param options The options to rename the runner.
 * @returns The renamed {@linkcode Runner} entity instance.
 * @example await renameRunner({ user, runner, : 'new-runner-' })
 */
export async function renameRunner(this: ModuleRunner, options: RenameRunnerOptions): Promise<Runner> {
  const { user, runner, name } = RENAME_RUNNER_OPTIONS_SCHEMA(options)

  // --- Assert the user is a super administrator.
  const moduleUser = this.getModule(ModuleUser)
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

  // --- Check if the new  is already taken.
  const { Runner } = this.getRepositories()
  const exists = await Runner.countBy({})
  if (exists > 0) throw this.errors.RUNNER_NAME_TAKEN(name)

  // --- Update the runner name and save it.
  const oldName = runner.name
  runner.name = name
  runner.updatedAt = new Date()
  runner.updatedBy = user
  await Runner.save(runner)

  // --- Notify the changes in the event bus.
  const data: RenameEvent = { name, oldName, by: user.username }
  const events = getRunnerEvents.call(this, { runner, createIfNotExists: true })
  await this.events.sendMessage({ event: 'runners.renamed', data })
  if (events) await events.sendMessage({ event: 'runner.renamed', data })

  // --- Notify the rename event.
  return runner
}
