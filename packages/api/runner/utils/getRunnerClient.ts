import type { ModuleRunner as ModuleRunnerLocal, RunnerClient } from '../index'
import { createParser } from '@unshared/validation'
import { assertRunner } from './assertRunner'
import { createRunnerClient } from './createRunnerClient'

/** The options for the {@linkcode getRunnerClient} function. */
export const GET_RUNNER_CLIENT_OPTIONS_SCHEMA = createParser({
  runner: assertRunner,
})

/** The options for the {@linkcode getRunnerClient} function. */
export type GetRunnerClient = ReturnType<typeof GET_RUNNER_CLIENT_OPTIONS_SCHEMA>

/**
 * Get or create a {@linkcode RunnerClient} for the specified runner.
 * If the client already exists, it will be returned. Otherwise, a new client
 * will be created and returned.
 *
 * @param options The options to get the runner client.
 * @returns The {@linkcode RunnerClient} instance for the specified runner.
 * @example getRunnerClient(runner)
 */
export function getRunnerClient(this: ModuleRunnerLocal, options: GetRunnerClient): RunnerClient {
  const { runner } = GET_RUNNER_CLIENT_OPTIONS_SCHEMA(options)

  // --- Check if the client already exists.
  const existingClient = this.clients.get(runner.id)
  if (existingClient) return existingClient

  // --- Create a new client and store it.
  const client = createRunnerClient.call(this, { runner })
  this.clients.set(runner.id, client)
  return client
}
