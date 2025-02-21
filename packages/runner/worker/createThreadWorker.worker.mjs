/* eslint-disable jsdoc/no-types */
import { abort, createThreadFromFlow, start } from '@nwrx/nano'
import { isThreadRunning } from '@nwrx/nano/utils'
import { noop } from '@unshared/functions'
import { serialize } from './serialize.mjs'
import { serializeError } from './serializeError.mjs'

/**
 * @typedef Thread
 * @type {import('@nwrx/nano').Thread}
 *
 * @typedef ThreadEventName
 * @type {ReadonlyArray<keyof import('@nwrx/nano').ThreadEventMap>}
 *
 * @typedef MessagePort
 * @type {import('worker_threads').MessagePort}
 *
 * @typedef ThreadClientMessage
 * @type {import('./threadClientMessage').ThreadClientMessage}
 *
 * @typedef TransferList
 * @type {import('node:worker_threads').TransferListItem[]}
 *
 * @typedef FlowV1
 * @type {import('@nwrx/nano').FlowV1}
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
 * @param {FlowV1} flow The flow to create the thread from.
 */
export function createThreadWorker(port, flow) {
  try {

    // --- Create a new thread from the given flow. Then listen to all it's events
    // --- and proxy them to the parent thread for further processing.
    const thread = createThreadFromFlow(flow)
    for (const event of EVENTS_TO_PROXY) {
      thread.on(event, (...payload) => {

        /** @type {TransferList} */
        const transferList = []
        const data = serialize(payload, transferList)
        port.postMessage({ event, data }, transferList)
      })
    }

    // --- Listen to the parent thread for incoming instructions.
    port.on('message', (/** @type {ThreadClientMessage} */ message) => {
      try {
        if (message.event === 'start') { void start(thread, message.data).catch(noop) }
        else if (message.event === 'abort') { abort(thread) }

        // --- Push the output value of the thread to the parent thread.
        else if (message.event === 'getOutputValue') {
          if (isThreadRunning(thread)) throw new Error('Thread is still running.')

          /** @type {TransferList} */
          const transferList = []
          const value = serialize(thread.output[message.name], transferList)
          port.postMessage({ event: 'worker:outputValue', data: [message.name, value] }, transferList)
        }
      }

      // --- If an error occurs, serialize the error and send it to the parent thread.
      catch (error) {
        port.postMessage({ event: 'error', data: [serializeError(error)] })
      }
    })

    // --- Notify the parent thread that the worker is ready to start.
    port.postMessage({ event: 'worker:ready' })
  }

  // --- If an error occurs, serialize the error and send it to the parent thread.
  catch (error) {
    port.postMessage({ event: 'error', data: [serializeError(error)] })
  }
}
