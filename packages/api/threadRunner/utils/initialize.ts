import type { ModuleThreadRunner } from '..'
import { IsNull } from 'typeorm'
import { createThreadRunnerClient } from './createThreadRunner'

/**
 * Collect all enabled thread runners from the database, instantiate a client
 * for each thread runner, and store the clients in the thread runner map. This
 * function will be called when the thread runner module is initialized, when
 * the application is started.
 *
 * @returns A promise that resolves when all thread runners are initialized.
 * @example await initialize.call(this)
 */

export async function initialize(this: ModuleThreadRunner) {
  const { ThreadRunner } = this.getRepositories()
  const threads = await ThreadRunner.findBy({ disabledAt: IsNull() })
  for (const thread of threads) {
    const client = createThreadRunnerClient({ address: thread.address, token: thread.token })
    this.threadRunners.set(thread.id, client)
  }
}
