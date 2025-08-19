import type { Loose } from '@unshared/types'
import type { Runner } from '../entities'
import type { ModuleRunner } from '../index'
import { assert, createParser } from '@unshared/validation'
import { assertUser, ModuleUser } from '../../user'
import { createRunnerClient } from './createRunnerClient'

/** The schema for the register thread runner options. */
export const REGISTER_RUNNER_OPTIONS_SCHEMA = createParser({
  user: assertUser,
  address: assert.stringNotEmpty,
  token: assert.stringNotEmpty,
})

/** The options for the register thread runner. */
export type RegisterRunnerOptions = Loose<ReturnType<typeof REGISTER_RUNNER_OPTIONS_SCHEMA>>

/**
 * Register a new remote thread runner. This will create a new thread runner
 * in the database and immediately claim it. This will also instantiate a new
 * thread runner client that can be used to interact with the thread runner.
 *
 * @param options The options to register the thread runner.
 * @returns The created {@linkcode Runner} entity instance.
 * @example await registerRunner({ user, address: 'http://localhost:3000' })
 */
export async function registerRunner(this: ModuleRunner, options: RegisterRunnerOptions): Promise<Runner> {
  const { address, token, user } = options

  // --- Assert the user is a super administrator.
  const moduleUser = this.getModule(ModuleUser)
  if (!user.isSuperAdministrator) throw moduleUser.errors.USER_FORBIDDEN()

  // --- Check if a runner with the same base URL already exists.
  const { Runner } = this.getRepositories()
  const exists = await Runner.countBy({ address })
  if (exists > 0) throw this.errors.RUNNER_ALREADY_REGISTERED(address)

  // --- Create the database record.
  const runner = Runner.create({
    name: '',
    token,
    address,
    createdBy: user,
    lastSeenAt: new Date(),
    isInitial: false,
  })

  // --- Claim the runner and create a client.
  const client = createRunnerClient({ runner })
  const { name } = await client.claim()

  // --- Check if a runner with the same name already exists.
  const existingRunner = await Runner.findOneBy({ name })
  if (existingRunner) throw this.errors.RUNNER_NAME_TAKEN(name)

  // --- Save the runner with the name.
  runner.name = name
  await Runner.save(runner)
  this.clients.set(runner.id, client)

  // --- Notify in the event bus and return the runner.
  const data = runner.serialize({ withCreatedBy: true, withUpdatedBy: true })
  await this.events.sendMessage({ event: 'runners.created', data })
  return runner
}
