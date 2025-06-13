import type { Loose } from '@unshared/types'
import type { ModuleThreadRunner } from '..'
import { assert, createParser } from '@unshared/validation'
import { assertUser } from '../../user'
import { createThreadRunnerClient } from './createThreadRunnerClient'

/** The schema for the register thread runner options. */
export const REGISTER_THREAD_RUNNER_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  address: assert.stringNotEmpty,
})

/** The options for the register thread runner. */
export type RegisterThreadRunnerOptions = Loose<ReturnType<typeof REGISTER_THREAD_RUNNER_OPTIONS_SCHEMA>>

/**
 * Register a new remote thread runner. This will create a new thread runner
 * in the database and immediately claim it. This will also instantiate a new
 * thread runner client that can be used to interact with the thread runner.
 *
 * @param options The options to register the thread runner.
 * @example await registerThreadRunner({ user, address: 'http://localhost:3000' })
 */
export async function registerThreadRunner(this: ModuleThreadRunner, options: RegisterThreadRunnerOptions) {
  const { address, user } = options

  // --- Assert the user is a super administrator.
  if (!user.isSuperAdministrator) throw this.errors.THREAD_RUNNER_FORBIDDEN()

  // --- Check if a thread runner with the same base URL already exists
  const { ThreadRunner } = this.getRepositories()
  const exists = await ThreadRunner.countBy({ address })
  if (exists > 0) throw this.errors.THREAD_RUNNER_ALREADY_REGISTERED(address)

  // --- Create the database record.
  const runner = ThreadRunner.create({
    token: 'none',
    address,
    identity: 'none',
    createdBy: user,
    lastSeenAt: new Date(),
  })

  // --- Register, claim, and store the thread runner.
  const client = createThreadRunnerClient.call(this, { address, runner })
  const { token, identity } = await client.claim()
  await client.ping()

  // --- Save the client and database record.
  this.threadRunners.set(runner.id, client)
  runner.token = token
  runner.identity = identity
  await ThreadRunner.save(runner)
}
