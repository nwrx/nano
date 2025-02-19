import type { ModuleThreadRunner } from '..'
import type { User } from '../../user'
import { randomUUID } from 'node:crypto'
import { createThreadRunner } from './createThreadRunner'

export interface RegisterThreadRunnerOptions {
  user: User
  address: string
}

export async function registerThreadRunner(this: ModuleThreadRunner, options: RegisterThreadRunnerOptions) {
  const { address, user } = options

  // --- Assert the user is a super administrator.
  if (!user?.isSuperAdministrator) throw this.errors.THREAD_RUNNER_FORBIDDEN()

  // --- Check if a thread runner with the same base URL already exists
  const { ThreadRunner } = this.getRepositories()
  const exists = await ThreadRunner.countBy({ address })
  if (exists > 0) throw this.errors.THREAD_RUNNER_ALREADY_REGISTERED(address)

  // --- Register, claim, and store the thread runner.
  const id = randomUUID()
  const client = createThreadRunner.call(this, address)
  const token = await client.claim()
  await client.ping()
  this.threadRunners.set(id, client)

  // --- Store the thread runner in the database.
  const runner = ThreadRunner.create({ id, address, token, lastSeenAt: new Date(), createdBy: user })
  await ThreadRunner.save(runner)
}
