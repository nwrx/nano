import type { ModuleRunner } from '..'
import { IsNull } from 'typeorm'
import { createRunnerClient } from './createRunnerClient'

/**
 * Collect all enabled thread runners from the database, instantiate a client
 * for each thread runner, and store the clients in the thread runner map. This
 * function will be called when the thread runner module is initialized, when
 * the application is started.
 *
 * @returns A promise that resolves when all thread runners are initialized.
 * @example await initialize.call(this)
 */

export async function initialize(this: ModuleRunner) {
  const { Runner } = this.getRepositories()
  const runners = await Runner.findBy({ disabledAt: IsNull() })
  for (const runner of runners) {
    const client = createRunnerClient({ address: runner.address, token: runner.token, runner })
    this.runnerClients.set(runner.id, client)
  }
}
