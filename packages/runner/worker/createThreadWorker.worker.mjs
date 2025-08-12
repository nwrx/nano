/* eslint-disable jsdoc/no-types */
import { abort, createThreadFromFlow, start } from '@nwrx/nano'
import { DEFAULT_COMPONENT_RESOLVER } from '@nwrx/nano/utils'
import { randomUUID } from 'node:crypto'
import { serialize } from './serialize.mjs'
import { serializeError } from './serializeError.mjs'

/**
 * @typedef Thread
 * @type {import('@nwrx/nano').Thread}
 *
 * @typedef ThreadEventNames
 * @type {ReadonlyArray<keyof import('@nwrx/nano').ThreadEventMap>}
 *
 * @typedef MessagePort
 * @type {import('worker_threads').MessagePort}
 *
 * @typedef ThreadServerMessage
 * @type {import('./types').ThreadServerMessage}
 *
 * @typedef ThreadClientMessage
 * @type {import('./types').ThreadClientMessage}
 *
 * @typedef TransferList
 * @type {import('node:worker_threads').TransferListItem[]}
 *
 * @typedef FlowV1
 * @type {import('@nwrx/nano').FlowV1}
 */

/** @type {ThreadEventNames} */
const EVENTS_TO_PROXY = [
  'start',
  'error',
  'abort',
  'input',
  'done',

  // node
  'nodeState',
  'nodeError',
  'nodeTrace',
  'nodeStart',
  'nodeDone',

  // output
  'nodeOutput',
  'nodeOutputDeltaStart',
  'nodeOutputDelta',
  'nodeOutputDeltaEnd',

  // fetch
  'nodeFetchRequest',
  'nodeFetchResponse',
  'nodeFetchError',
  'nodeFetchCancel',

  // confirm
  'nodeConfirmRequest',
  'nodeConfirmResponse',
  'nodeConfirmCancel',

  // question
  'nodeQuestionRequest',
  'nodeQuestionResponse',
  'nodeQuestionCancel',

  // chat
  // 'nodeChatRequest',
  // 'nodeChatResponse',
  'nodeChatEvent',
  'nodeChatError',
]

/**
 * @param {MessagePort} port The port to use for IPC communication.
 * @param {FlowV1} flow The flow to create the thread from.
 * @returns {Thread} The created thread.
 */
function loadThread(port, flow) {
  const thread = createThreadFromFlow(flow, {
    componentResolvers: [
      DEFAULT_COMPONENT_RESOLVER,
    ],
    referenceResolvers: [async(type, ...values) => {
      const id = randomUUID()
      const /** @type {ThreadServerMessage} */ message = { event: 'worker.references.resolve', data: [id, type, values] }
      port.postMessage(message)

      // --- Wait for the response from the main API.
      const /** @type {unknown} */ value = await new Promise((resolve) => {
        const callback = (/** @type {ThreadClientMessage} */ message) => {
          if (message.event !== 'worker.references.result') return
          const { id: responseId, value } = message.data
          if (responseId !== id) return
          port.off('message', callback)
          resolve(value)
        }
        port.on('message', callback)
      })
      return value
    }],
  })

  // --- Listen to all whitelisted events and forward them to the parent thread.
  for (const event of EVENTS_TO_PROXY) {
    thread.on(event, (...payload) => {
      const /** @type {TransferList} */ transferList = []
      const data = serialize(payload, transferList)
      port.postMessage({ event, data }, transferList)
    })
  }

  // --- Return the thread.
  return thread
}

/**
 * @param {MessagePort} port The port to use for IPC communication.
 */
export function createThreadWorker(port) {
  let /** @type {Thread | undefined} */ thread

  /**
   * @param {ThreadServerMessage} message The message to post to the parent thread.
   */
  function postMessage(message) {
    port.postMessage(message)
  }

  // --- Listen to the parent thread for incoming instructions.
  port.on('message', (/** @type {ThreadClientMessage} */ message) => {
    try {

      // --- Load the flow and create a thread from it.
      if (message.event === 'worker.load') {
        if (thread) {
          thread.abortController?.abort()
          thread.abortController = new AbortController()
          thread.clear()
        }
        thread = loadThread(port, message.data)
        postMessage({ event: 'worker.loaded' })
      }

      // --- Start the thread with the provided data as input.
      if (message.event === 'worker.start') {
        if (!thread) {
          return postMessage({
            event: 'worker.error',
            data: {
              '@instanceOf': 'Error',
              'name': 'E_THREAD_NOT_LOADED',
              'message': 'No thread loaded. Please load a flow before starting the thread.',
            },
          })

        }
        void start(thread, message.data)
      }

      // --- Abort the thread if it is running.
      else if (message.event === 'worker.abort') {
        if (!thread) return
        abort(thread)
      }
    }

    // --- If an error occurs, serialize the error and send it to the parent thread.
    catch (error) {
      port.postMessage({ event: 'worker.error', data: serializeError(error) })
    }
  })

  // --- Notify the parent thread that the worker is ready to start.
  port.postMessage({ event: 'worker.ready' })
}
