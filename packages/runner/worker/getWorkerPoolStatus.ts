import type { ModuleRunner } from '../application'

export interface ThreadRunnerWorkerPoolStatus {
  threadId: number
  uptime: number
  cpuUsage: NodeJS.CpuUsage
  memoryUsage: NodeJS.MemoryUsage
  resourceUsage: NodeJS.ResourceUsage
}

export function getWorkerPoolStatus(this: ModuleRunner): Promise<ThreadRunnerWorkerPoolStatus[]> {
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

  // --- Return the status of each worker.
  return Promise.all(promises)
}
