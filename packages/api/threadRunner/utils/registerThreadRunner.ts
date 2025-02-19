import type { ModuleThreadRunner } from '..'
import type { User } from '../../user'
import { randomUUID } from 'node:crypto'
import { createThreadRunner } from './createThreadRunner'

export interface RegisterThreadRunnerOptions {
  user: User
  baseUrl: string
}

export async function registerThreadRunner(this: ModuleThreadRunner, options: RegisterThreadRunnerOptions) {
  const { baseUrl, user } = options

  // --- Assert the user is a super administrator.
  if (!user?.isSuperAdministrator) throw this.errors.THREAD_RUNNER_FORBIDDEN()

  // --- Check if a thread runner with the same base URL already exists
  const { ThreadRunner } = this.getRepositories()
  const exists = await ThreadRunner.countBy({ baseUrl })
  if (exists > 0) throw this.errors.THREAD_RUNNER_ALREADY_REGISTERED(baseUrl)

  // --- Register, claim, and store the thread runner.
  const id = randomUUID()
  const client = createThreadRunner.call(this, baseUrl)
  const token = await client.claim()
  await client.ping()
  this.threadRunners.set(id, client)

  // --- Store the thread runner in the database.
  const runner = ThreadRunner.create({ id, baseUrl, token, lastSeenAt: new Date(), createdBy: user })
  await ThreadRunner.save(runner)
}
