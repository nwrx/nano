/* eslint-disable jsdoc/no-types */
import { abort, createThreadFromFlow, start } from '@nwrx/nano'
import { COMPONENTS } from '@nwrx/nano/components'
import { noop } from '@unshared/functions'
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
 * @type {import('./threadServerMessage').ThreadServerMessage}
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
  'nodeChatRequest',
  'nodeChatResponse',
  'nodeChatEvent',
  'nodeChatError',
]

/**
 * @param {MessagePort} port The port to use for IPC communication.
 * @param {FlowV1} flow The flow to create the thread from.
 */
export function createThreadWorker(port, flow) {
  try {

    // --- Create a thread from the flow.
    const thread = createThreadFromFlow(flow, {
      componentResolvers: [(specifier) => {
        if (specifier.registry !== 'default') return
        if (specifier.workspace !== 'nanoworks') return
        if (specifier.name in COMPONENTS === false) return
        // @ts-expect-error: key exists
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return COMPONENTS[specifier.name]
      }],

      // --- Ask the main API to resolve the reference.
      referenceResolvers: [async(type, ...values) => {
        const id = randomUUID()

        /** @type {ThreadServerMessage} */
        const message = { event: 'workerResolveReference', data: [id, type, values] }
        port.postMessage(message)

        // --- Wait for the response from the main API.
        /** @type {unknown} */
        const value = await new Promise((resolve) => {
          const callback = (/** @type {ThreadClientMessage} */ message) => {
            if (message.event !== 'workerResolveReferenceResult') return
            const [{ id: responseId, value }] = message.data
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

        /** @type {TransferList} */
        const transferList = []
        const data = serialize(payload, transferList)
        port.postMessage({ event, data }, transferList)
      })
    }

    // --- Listen to the parent thread for incoming instructions.
    port.on('message', (/** @type {ThreadClientMessage} */ message) => {
      try {
        if (message.event === 'workerStart') {
          const [data] = message.data
          void start(thread, data).catch(noop)
        }
        else if (message.event === 'workerAbort') {
          abort(thread)
        }
      }

      // --- If an error occurs, serialize the error and send it to the parent thread.
      catch (error) {
        port.postMessage({ event: 'error', data: [serializeError(error)] })
      }
    })

    // --- Notify the parent thread that the worker is ready to start.
    /** @type {ThreadServerMessage} */
    const message = { event: 'workerReady' }
    port.postMessage(message)
  }

  // --- If an error occurs, serialize the error and send it to the parent thread.
  catch (error) {
    port.postMessage({ event: 'error', data: [serializeError(error)] })
  }
}
