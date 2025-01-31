import type { FlowV1, ThreadEventMap, ThreadInputObject } from '@nwrx/core'
import type { ObjectLike } from '@unshared/types'
import type { MessagePort } from 'node:worker_threads'
import type { ModuleRunner } from '..'
import type { ThreadClientMessage } from './threadClientMessage'
import { MessageChannel } from 'node:worker_threads'

export type ThreadWorkerMessage =
  | { [K in keyof ThreadEventMap]: { event: K; data: ThreadEventMap[K] } }[keyof ThreadEventMap]
  | { event: 'worker:created'; data: [id: string] }
  | { event: 'worker:outputValue'; data: [name: string, value: unknown] }

export type ThreadSessionMessage =
  | { event: 'done'; data: [ObjectLike] }

export class ThreadWorker {
  constructor(public port: MessagePort) {}

  create(data: FlowV1) {
    this.port.postMessage({ event: 'create', data } as ThreadClientMessage)
    return new Promise<void>((resolve, reject) => {
      const callback = (message: ThreadWorkerMessage) => {
        if (message.event === 'worker:created') {
          this.port.off('message', callback)
          resolve()
        }
      }
      this.port.once('error', reject)
      this.port.on('message', callback)
    })
  }

  start(data: ThreadInputObject) {
    this.port.postMessage({ event: 'start', data } as ThreadClientMessage)
    return new Promise<ObjectLike>((resolve, reject) => {
      const callback = (message: ThreadWorkerMessage) => {
        if (message.event === 'done') {
          const [result] = message.data
          this.port.off('message', callback)
          this.port.off('error', reject)
          resolve(result)
        }
        if (message.event === 'error') {
          const [error] = message.data
          this.port.off('message', callback)
          this.port.off('error', reject)
          reject(error)
        }
      }
      this.port.once('error', reject)
      this.port.on('message', callback)
    })
  }

  abort() {
    this.port.emit('message', { event: 'abort' } as ThreadClientMessage)
    return new Promise<void>((resolve, reject) => {
      const callback = (message: ThreadWorkerMessage) => {
        if (message.event === 'abort') {
          this.port.off('message', callback)
          resolve()
        }
      }
      this.port.once('error', reject)
      this.port.on('message', callback)
    })
  }

  getOutputValue(name: string) {
    this.port.postMessage({ event: 'getOutputValue', name } as ThreadClientMessage)
    return new Promise<unknown>((resolve, reject) => {
      const callback = (message: ThreadWorkerMessage) => {
        if (message.event === 'worker:outputValue') {
          const [outputName, value] = message.data
          if (outputName !== name) return
          this.port.off('message', callback)
          resolve(value)
        }
      }
      this.port.once('error', reject)
      this.port.on('message', callback)
    })
  }

  dispose() {
    this.port.close()
  }
}

export function createThreadWorker(this: ModuleRunner) {
  type Module = typeof import('./createThreadWorker.worker.mjs').createThreadWorker
  const moduleId = new URL('createThreadWorker.worker.mjs', import.meta.url).pathname
  const { port1, port2 } = new MessageChannel()

  // --- Create a new thread that we can interact with in a separate worker.
  // --- This allows us to balance the load of running multiple threads across
  // --- multiple CPUs / threads.
  void this.runnerWorkerPool.spawn<Module>(moduleId, {
    name: 'createThreadWorker',
    parameters: [port2],
  })

  // --- Return an instance of the thread that we can interact with.
  return new ThreadWorker(port1)
}
