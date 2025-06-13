import type { ModuleThreadRunner } from '..'
import { IsNull } from 'typeorm'
import { createThreadRunnerClient } from './createThreadRunnerClient'

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
  const runners = await ThreadRunner.findBy({ disabledAt: IsNull() })
  for (const runner of runners) {
    const client = createThreadRunnerClient({ address: runner.address, token: runner.token, runner })
    this.threadRunners.set(runner.id, client)
  }
}
