import type { ModuleRunner } from '../application'

export function getWorkerPoolStatus(this: ModuleRunner) {
  type Module = typeof import('./getWorkerPoolStatus.worker.mjs').getWorkerPoolStatus
  const moduleId = new URL('getWorkerPoolStatus.worker.mjs', import.meta.url).pathname

  // --- Initialize the worker pool if it's empty.
  if (this.runnerWorkerPool.workers.length === 0)
    this.runnerWorkerPool.initialize()

  // --- Get the status of each worker.
  const promises = this.runnerWorkerPool.workers.map(async worker => ({
    running: worker.running,
    ...await worker.spawn<Module>(moduleId, { name: 'getWorkerPoolStatus' }),
  }))
  return Promise.all(promises)
}
