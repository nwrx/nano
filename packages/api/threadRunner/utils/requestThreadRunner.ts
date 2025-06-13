import type { ModuleThreadRunner } from '../index'
import type { ThreadRunnerClient } from './createThreadRunnerClient'

/**
 * Request a thread runner to run a flow. This will query all available thread
 * runners and select the one that has the lowest load. If no thread runners are
 * available, this will throw an error.
 *
 * @returns A `ThreadRunner` instance that can be used to interact with the thread.
 * @example await requestThreadRunner().createThread({ version: '1', nodes: {} })
 */
export async function requestThreadRunner(this: ModuleThreadRunner): Promise<ThreadRunnerClient> {
  const threadRunners = [...this.threadRunners.values()]
  if (threadRunners.length === 0) throw this.errors.THREAD_RUNNER_NO_RUNNERS_AVAILABLE()

  // --- Find the thread runner with the lowest load.
  let minLoad = Infinity
  let threadRunner = threadRunners[0]
  for (const runner of threadRunners) {
    const status = await runner.getStatus()
    for (const pool of status.workerPool) {
      const load = pool.cpuUsage.user + pool.cpuUsage.system
      if (load > minLoad) continue
      minLoad = load
      threadRunner = runner
    }
  }

  // --- Return the thread runner with the lowest load.
  return threadRunner
}
