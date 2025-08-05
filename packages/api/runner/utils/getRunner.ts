import type { Loose } from '@unshared/types'
import type { ModuleRunner } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertUser, ModuleUser } from '../../user'

/** The schema for the {@linkcode getRunner} function options. */
export const GET_RUNNER_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  name: assert.stringNotEmpty,
  withCreatedBy: [[assert.undefined], [assert.boolean]],
  withUpdatedBy: [[assert.undefined], [assert.boolean]],
  withDisabledBy: [[assert.undefined], [assert.boolean]],
  withDeleted: [[assert.undefined], [assert.boolean]],
})

/** The options for the {@linkcode getRunner} function. */
export type GetRunnerOptions = Loose<ReturnType<typeof GET_RUNNER_OPTIONS_SCHEMA>>

/**
 * Get a thread runner by its . This will return the thread runner
 * object if it exists, otherwise it will throw an error.
 *
 * @param options The options to get the thread runner.
 * @returns The thread runner entity if it exists.
 * @example await getRunner({ : 'runner-', user })
 */
export async function getRunner(this: ModuleRunner, options: GetRunnerOptions) {
  const {
    user,
    name,
    withCreatedBy = false,
    withUpdatedBy = false,
    withDisabledBy = false,
    withDeleted = false,
  } = options

  // --- Assert the user is a super administrator.
  const moduleUser = this.getModule(ModuleUser)
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

  // --- Get runner from the database.
  const { Runner } = this.getRepositories()
  const runner = await Runner.findOne({
    where: { name },
    withDeleted,
    relations: {
      createdBy: withCreatedBy,
      updatedBy: withUpdatedBy,
      disabledBy: withDisabledBy,
    },
  })

  // --- If the runner does not exist, throw an error.
  if (!runner) throw this.errors.RUNNER_NOT_FOUND(name)
  return runner
}
