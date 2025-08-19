import type { ModuleRunner } from '../index'
import { createRunnerClient } from './createRunnerClient'

/**
 * Initialize the runner module by registering initial runners from the
 * environment configuration and removing obsolete initial runners from
 * the database.
 *
 * @example
 * const moduleRunner = new ModuleRunner({
 *   initialRunners: ['http://token1@example.com:token1', 'http://token2@example.com:token2']
 * })
 */
export async function initialize(this: ModuleRunner): Promise<void> {
  const { Runner } = this.getRepositories()

  // --- Get already registered initial runners.
  const initialRunners = await Runner.findBy({ isInitial: true })
  const newInitialRunners: string[] = []

  // --- Get the initial runners from options
  for (const runnerUrl of this.initialRunners) {
    try {
      const url = new URL(runnerUrl)
      const address = url.origin // Omitting the token part
      const token = url.username // Assuming the token is passed as the username in the URL
      if (!address || !token) throw this.errors.RUNNER_INITIAL_RUNNER_BAD_FORMAT(runnerUrl)

      // --- Check if runner already exists, update the token.
      const existingRunner = await Runner.findOneBy({ address })
      if (existingRunner) {
        existingRunner.token = token
        existingRunner.isInitial = true
        await Runner.save(existingRunner)
        newInitialRunners.push(address)
        continue
      }

      // --- Create the database record.
      const runner = Runner.create({
        address,
        token,
        name: '',
        isInitial: true,
        lastSeenAt: new Date(),
      })

      // --- Claim the runner and create a client.
      const client = createRunnerClient({ runner })
      const { name } = await client.claim()
      runner.name = name
      await Runner.save(runner)
      newInitialRunners.push(address)
      this.clients.set(runner.id, client)
    }
    catch (error) {
      this.logger.error(error)
    }
  }

  // --- Remove obsolete initial runners from the database.
  for (const runner of initialRunners) {
    if (!newInitialRunners.includes(runner.address)) {
      await Runner.remove(runner)
      this.logger.warn(`Removed obsolete initial runner: ${runner.address}`)
    }
  }
}
