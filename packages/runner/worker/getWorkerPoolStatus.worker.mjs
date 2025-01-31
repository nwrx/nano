import { threadId } from 'node:worker_threads'

export function getWorkerPoolStatus() {
  return {
    threadId,
    uptime: process.uptime(),
    cpuUsage: process.cpuUsage(),
    memoryUsage: process.memoryUsage(),
    resourceUsage: process.resourceUsage(),
  }
}
