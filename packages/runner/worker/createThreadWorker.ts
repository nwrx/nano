import type { FlowV1, ThreadEventMap, ThreadInputObject } from '@nwrx/nano'
import type { ObjectLike } from '@unshared/types'
import type { MessagePort } from 'node:worker_threads'
import type { ModuleRunner } from '../application'
import type { SerializedError } from './deserializeError'
import type { ThreadClientMessage } from './threadClientMessage'
import { createError } from '@unserved/server'
import { MessageChannel } from 'node:worker_threads'
import { deserializeError } from './deserializeError'

export type ThreadWorkerMessage =
  | { [K in keyof ThreadEventMap]: { event: K; data: ThreadEventMap[K] } }[keyof ThreadEventMap]
  | { event: 'worker:outputValue'; data: [name: string, value: unknown] }
  | { event: 'worker:ready'; data: [id: string] }

export type ThreadSessionMessage =
  | { event: 'done'; data: [ObjectLike] }

export class ThreadWorker {
  constructor(public port: MessagePort) {}

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

  async dispose() {
    await this.abort()
    this.port.close()
  }
}

/**
 * Create a new thread worker for the given flow. This will initialize a new
 * thread in a worker thread (thread-ception) and return a wrapper around the
 * `MessagePort` that allows us to interact with the thread.
 *
 * @param flow The flow to create a thread for.
 * @returns A new thread worker instance.
 * @example
 * // Create a new thread worker for the given flow.
 * const thread = await createThreadWorker(flow)
 *
 * // Start the thread with the given input object.
 * const result = await thread.start({ input: 'object' })
 */
export async function createThreadWorker(this: ModuleRunner, flow: FlowV1) {
  type Module = typeof import('./createThreadWorker.worker.mjs').createThreadWorker
  const moduleId = new URL('createThreadWorker.worker.mjs', import.meta.url).pathname
  const { port1, port2 } = new MessageChannel()

  // --- Create a new thread that we can interact with in a separate worker.
  // --- This allows us to balance the load of running multiple threads across
  // --- multiple CPUs / threads.
  void this.runnerWorkerPool.spawn<Module>(moduleId, {
    name: 'createThreadWorker',
    parameters: [port2, flow],
  })

  // --- Wait for the worker to be ready before returning the thread.
  await new Promise<void>((resolve, reject) => {
    const callback = (message: ThreadWorkerMessage) => {
      if (message.event === 'worker:ready') { port1.off('message', callback); resolve() }
      if (message.event === 'error') {
        port1.off('message', callback)
        const error = deserializeError(message.data[0] as SerializedError)
        reject(createError({
          name: error.name as 'E_FLOW_ERROR',
          message: error.message,
          statusCode: error.name.startsWith('E_') ? 400 : 500,
          statusMessage: error.name.startsWith('E_') ? 'Bad Request' : 'Internal Server Error',
        }))
      }
    }
    port1.once('error', reject)
    port1.on('message', callback)
  })

  // --- Return an instance of the thread that we can interact with.
  return new ThreadWorker(port1)
}
