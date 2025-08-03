import type { ModuleRunner } from '../index'
import type { RunnerClient } from './createRunnerClient'

/**
 * Request a thread runner to run a flow. This will query all available thread
 * runners and select the one that has the lowest load. If no thread runners are
 * available, this will throw an error.
 *
 * @returns A `Runner` instance that can be used to interact with the thread.
 * @example await requestRunner().createThread({ version: '1', nodes: {} })
 */
export async function requestRunner(this: ModuleRunner): Promise<RunnerClient> {
  const clients = [...this.runnerClients.values()]
  if (clients.length === 0) throw this.errors.THREAD_RUNNER_NO_RUNNERS_AVAILABLE()

  // --- Find the thread runner with the lowest load.
  let minLoad = Infinity
  let result = clients[0]
  for (const client of clients) {
    const status = await client.getStatus()
    for (const pool of status.workerPool) {
      const load = pool.cpuUsage.user + pool.cpuUsage.system
      if (load > minLoad) continue
      minLoad = load
      result = client
    }
  }

  // --- Return the thread runner with the lowest load.
  return result
}
