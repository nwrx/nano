/* eslint-disable jsdoc/no-types */
import { abort, createThreadFromFlow, start } from '@nwrx/core'
import { isThreadRunning } from '@nwrx/core/utils'
import { noop } from '@unshared/functions'
import { serialize } from './serialize.mjs'
import { serializeError } from './serializeError.mjs'

/**
 * @typedef Thread
 * @type {import('@nwrx/core').Thread}
 *
 * @typedef ThreadEventName
 * @type {ReadonlyArray<keyof import('@nwrx/core').ThreadEventMap>}
 *
 * @typedef MessagePort
 * @type {import('worker_threads').MessagePort}
 *
 * @typedef ThreadClientMessage
 * @type {import('./threadClientMessage').ThreadClientMessage}
 *
 * @typedef TransferList
 * @type {import('node:worker_threads').TransferListItem[]}
 */

/** @type {ThreadEventName} */
const EVENTS_TO_PROXY = [
  'start',
  'error',
  'abort',
  'input',
  'done',
  'nodeState',
  'nodeError',
  'nodeEvent',
  'nodeStart',
  'nodeDone',
  'nodeOutput',
  'nodeResponse',
  'nodeQuestionRequest',
  'nodeQuestionCancel',
  'nodeConfirmRequest',
  'nodeMessage',
  'nodeMessageDeltaStart',
  'nodeMessageDelta',
  'nodeMessageDeltaEnd',
  'nodeToolRequest',
  'nodeToolResponse',
  'nodeToolError',
  'nodeRequest',
  'nodeRequestResponse',
  'nodeRequestError',
]

/**
 * @param {MessagePort} port The port to use for IPC communication.
 */
export function createThreadInWorker(port) {

  /** @type {Thread | undefined} */
  let thread
  port.on('message', (/** @type {ThreadClientMessage} */ message) => {
    try {

      // --- Create a new thread from the given flow. Then listen to all it's events
      // --- and proxy them to the parent thread for further processing.
      if (message.event === 'create') {
        if (thread) throw new Error('Thread is already created.')
        thread = createThreadFromFlow(message.data)
        for (const event of EVENTS_TO_PROXY) {
          thread.on(event, (...payload) => {

            /** @type {TransferList} */
            const transferList = []
            const data = serialize(payload, transferList)
            port.postMessage({ event, data }, transferList)
          })
        }
      }

      // --- At this point, if there is no thread, we can't do anything.
      if (!thread) throw new Error('Thread is not created yet.')
      if (message.event === 'start') void start(thread, message.data).catch(noop)
      if (message.event === 'abort') abort(thread)

      // --- Push the output value of the thread to the parent thread.
      if (message.event === 'getOutputValue') {
        if (isThreadRunning(thread)) throw new Error('Thread is still running.')

        /** @type {TransferList} */
        const transferList = []
        const value = serialize(thread.output[message.name], transferList)
        port.postMessage({ event: 'worker:outputValue', data: [message.name, value] }, transferList)
      }
    }

    // --- If an error occurs, serialize the error and send it to the parent thread.
    catch (error) {
      port.postMessage({ type: 'error', error: serializeError(error) })
    }
  })
}
