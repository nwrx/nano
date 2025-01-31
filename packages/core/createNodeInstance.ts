import type { SocketListOption } from '@nwrx/core'
import type { Flow } from './createFlow'
import type { DataFromSchema, DataSchema } from './defineDataSchema'
import type { DataSocket } from './defineDataSchema'
import type { InstanceContext, Node } from './defineNode'
import type { ResultFromSchema, ResultSchema } from './defineResultSchema'
import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'

const REFERENCE_EXP = /^\$(?<type>[A-Z]+)\.(?<name>[\w-/:]+)$/

export type NodeState =
  | 'DESTROYED'
  | 'DONE'
  | 'IDLE'
  | 'RUNNING/PROCESSING'
  | 'RUNNING/RESOLVING_DATA'
  | 'RUNNING/RESOLVING_RESULT'

export interface NodeEventMeta {
  state: NodeState
  executionId: string
  threadId?: string
  delta: number
  duration: number
  timestamp: number
}

export interface NodeMeta {
  label?: string
  comment?: string
  position?: { x: number; y: number }
  [key: string]: unknown
}

export interface NodeEvents<T extends DataSchema, U extends ResultSchema> {
  meta: [key: string, value: unknown, meta: NodeEventMeta]
  state: [state: NodeState, meta: NodeEventMeta]

  // Result
  result: [result: ResultFromSchema<U>, meta: NodeEventMeta]
  resultSchema: [schema: U, meta: NodeEventMeta]
  resultParseError: [key: string, error: Error, meta: NodeEventMeta]

  // Data
  data: [data: Record<string, unknown>, meta: NodeEventMeta]
  dataSchema: [schema: T, meta: NodeEventMeta]
  dataParseError: [key: string, error: Error, meta: NodeEventMeta]

  // Execution
  start: [data: DataFromSchema<T>, meta: NodeEventMeta]
  skip: [data: Record<string, unknown>, meta: NodeEventMeta]
  end: [data: DataFromSchema<T>, result: ResultFromSchema<U>, meta: NodeEventMeta]
  error: [error: Error, meta: NodeEventMeta]
  abort: [meta: NodeEventMeta]
}

export type NodeListener<T extends DataSchema, U extends ResultSchema, K extends keyof NodeEvents<T, U>> =
  (...parameters: NodeEvents<T, U>[K]) => Promise<void> | void

export interface NodeInstanceOptions<T extends DataSchema = DataSchema, U extends ResultSchema = ResultSchema> {
  id?: string
  flow?: Flow
  meta?: NodeMeta
  initialData?: DataFromSchema<T>
  initialResult?: ResultFromSchema<U>
  resolveReference?: (type: string, name: string) => any
}

export class NodeInstance<T extends DataSchema = DataSchema, U extends ResultSchema = ResultSchema> {
  constructor(public node: Node<string, T, U>, options: NodeInstanceOptions<T, U> = {}) {
    if (options.id) this.id = options.id
    if (options.flow) this.flow = options.flow
    if (options.meta) this.meta = options.meta
    if (options.initialData) this.data = { ...options.initialData }
    if (options.initialResult) this.result = { ...options.initialResult }
    if (typeof this.node.dataSchema === 'object') this.dataSchema = { ...this.node.dataSchema }
    if (typeof this.node.resultSchema === 'object') this.resultSchema = { ...this.node.resultSchema }
    if (options.resolveReference) this.resolveReference = options.resolveReference
  }

  public id = randomUUID() as string
  public flow: Flow | undefined
  public error: Error | undefined

  /***************************************************************************/
  /* Meta                                                                    */
  /***************************************************************************/

  public meta = {} as NodeMeta

  /**
   * Set a specific value in the meta object of the flow. This allows us to reduce
   * the payload size when sending updates to the client by only sending the updated
   * value instead of the entire meta object.
   *
   * @param key The key of the value to set in the meta object.
   * @param value The value to set in the meta object.
   */
  public setMeta(key: string, value: unknown) {
    this.meta = { ...this.meta, [key]: value }
    this.dispatch('meta', key, value, this.eventMeta)
  }

  /***************************************************************************/
  /* State                                                                   */
  /***************************************************************************/

  private internalState: NodeState = 'IDLE'

  private set state(state: NodeState) {
    this.internalState = state
    this.dispatch('state', state, this.eventMeta)
  }

  public get state(): NodeState {
    return this.internalState
  }

  /***************************************************************************/
  /* Private methods                                                         */
  /***************************************************************************/

  private resolveReference
  private abortController = new AbortController()
  private executionId = randomUUID() as string
  private executionStart = Date.now()
  private executionIndex = 0

  private get eventMeta(): NodeEventMeta {
    return {
      state: this.state,
      executionId: this.executionId,
      threadId: this.flow?.threadId,
      delta: Date.now() - this.executionStart,
      duration: Date.now() - this.executionStart,
      timestamp: Date.now(),
    }
  }

  private get context(): InstanceContext<DataFromSchema<T>, ResultFromSchema<U>> {
    return {
      data: this.dataResolved,
      result: this.result,
      abortSignal: this.abortController.signal,
    }
  }

  /***************************************************************************/
  /* Event handling                                                          */
  /***************************************************************************/

  private eventTarget = new EventTarget()
  private eventHandlers: Array<[event: string, handler: EventListener]> = []

  /**
   * Add a listener for a flow node event. The listener is called when the event
   * is dispatched by the flow node.
   *
   * @param event The event to listen for.
   * @param listener The listener to call when the event is dispatched.
   * @returns A function that removes the listener when called.
   */
  public on<K extends keyof NodeEvents<T, U>>(event: K, listener: NodeListener<T, U, K>): () => void {
    const handler = (event: Event) => { void listener(...(event as CustomEvent<NodeEvents<T, U>[K]>).detail) }
    this.eventTarget.addEventListener(event, handler)
    this.eventHandlers.push([event as string, handler])
    return () => this.eventTarget.removeEventListener(event, handler)
  }

  private dispatch<K extends keyof NodeEvents<T, U>>(event: K, ...data: NodeEvents<T, U>[K]) {
    const customEvent = new CustomEvent(event as string, { detail: data })
    this.eventTarget.dispatchEvent(customEvent)
  }

  /***************************************************************************/
  /* Data handling                                                           */
  /***************************************************************************/

  public data = {} as Record<string, unknown>
  public dataSchema = {} as T
  public dataResolved = {} as DataFromSchema<T>
  public dataParseErrors: Record<string, Error> = {}
  public isDataReady = false

  private async resolveDataValue(value: unknown, socket?: DataSocket): Promise<unknown> {
    if (typeof value === 'string' && REFERENCE_EXP.test(value)) {
      const { type, name } = REFERENCE_EXP.exec(value)!.groups!

      // --- Value from node result.
      if (type === 'NODE') {
        if (!this.flow) throw new Error('Flow is not defined')
        const [id, key] = name.split(':')
        const node = this.flow.get(id)
        if (node.state !== 'DONE') this.isDataReady = false
        return node.result[key]
      }

      if (!this.resolveReference) throw new Error('Reference resolver is not defined')
      return await this.resolveReference(type, name)
    }

    // --- Raw value.
    if (!socket) return value
    if (value === undefined) return socket.defaultValue
    return socket.type.parse(value)
  }

  public async resolveData(): Promise<void> {
    this.state = 'RUNNING/RESOLVING_DATA'
    const dataResolved = {} as Record<string, unknown>
    const dataErrors = {} as Record<string, Error>

    // --- Get the parser for the data property.
    this.isDataReady = true
    for (const key in this.dataSchema) {
      try {
        const value = this.data[key]
        const socket = this.dataSchema[key]
        if (socket?.isIterable) {
          const array = Array.isArray(value) ? value : [value]
          const promises = array.filter(Boolean).map(x => this.resolveDataValue(x, socket))
          dataResolved[key] = await Promise.all(promises)
        }
        else {
          dataResolved[key] = await this.resolveDataValue(value, socket)
        }
      }
      catch (error) {
        dataErrors[key] = error as Error
        this.dispatch('dataParseError', key, error as Error, this.eventMeta)
        console.error((error as Error).message)
        this.isDataReady = false
      }
    }

    // --- Set the resolved data and return it.
    this.dataParseErrors = dataErrors
    this.dataResolved = dataResolved as DataFromSchema<T>
    this.state = 'IDLE'
  }

  /**
   * Set the value of a data property of the node by key.
   *
   * @param key The key of the data property.
   * @param value The value of the data property.
   */
  public setDataValue<K extends keyof T>(key: K, value: DataFromSchema<T>[K]): void {
    this.data[key as string] = value
    this.dispatch('data', this.data, this.eventMeta)
  }

  /***************************************************************************/
  /* Result handling                                                         */
  /***************************************************************************/

  public result = {} as ResultFromSchema<U>
  public resultSchema = {} as U
  public resultParseErrors: Record<string, Error> = {}

  private resolveResult(result: ResultFromSchema<U>): void {
    this.state = 'RUNNING/RESOLVING_RESULT'
    const resultFinal: Record<string, unknown> = {}
    const resultErrors: Record<string, Error> = {}

    for (const key in this.resultSchema) {
      try {
        const value = result[key]
        const socket = this.resultSchema[key]
        if (value === undefined && socket.isOptional) continue
        resultFinal[key] = socket.type.parse(value)
      }
      catch (_error) {
        const error = _error instanceof ValidationError ? _error : new Error(_error as string)
        const message = `Unexpected result on "${key}"`
        error.message = `${message}: ${error.message}`
        this.dispatch('dataParseError', key, error, this.eventMeta)
        console.warn(error)
        resultFinal[key] = undefined
        resultErrors[key] = error
      }
    }
    this.resultParseErrors = resultErrors
    this.result = resultFinal as ResultFromSchema<U>
    this.dispatch('result', this.result, this.eventMeta)
  }

  /***************************************************************************/
  /* Helpers                                                                 */
  /***************************************************************************/

  public getDataSocket<K extends keyof T & string>(key: K): T[K] {
    const socket = this.dataSchema[key]
    if (!socket) throw new Error(`Socket "${key}" does not exist in the data schema`)
    return socket
  }

  public getResultSocket<K extends keyof U & string>(key: K): U[K] {
    const socket = this.resultSchema[key]
    if (!socket) throw new Error(`Socket "${key}" does not exist in the result schema`)
    return socket
  }

  public async getDataOptions<K extends keyof T & string>(key: K, query?: string): Promise<SocketListOption[]> {
    const socket = this.getDataSocket(key)
    if (!socket.options) throw new Error(`Socket "${key}" does not have options`)
    if (typeof socket.options === 'function') return await socket.options(this.context, query)
    return socket.options
  }

  /***************************************************************************/
  /* Result handling                                                         */
  /***************************************************************************/

  /**
   * Process the node by calling the `process` function of the node with the
   * context of the node. The context contains the data, the secrets, the
   * variables, and the abort signal.
   *
   * @returns The result of the node processing.
   * @example
   *
   * // Create a new flow with a single node.
   * using flow = createFlow({ modules: [Core] })
   * const node = flow.node('core:parse-json', { initialData: { json: '{"key": "value"}' } })
   *
   * // Start processing the node right away.
   * const result = await node.start()
   */
  public async start(): Promise<ResultFromSchema<U> | undefined> {
    if (this.state === 'DESTROYED') throw new Error('Node has been destroyed')
    if (this.state === 'RUNNING/PROCESSING') throw new Error('Node is already running')
    if (this.state === 'RUNNING/RESOLVING_DATA') throw new Error('Node is already running')

    // --- Initialize and resolve the data schema and the result schema.
    try {
      await this.resolveData()
      if (!this.isDataReady) return

      // --- Process the node by calling the process function of the node.
      if (this.node.process) {
        this.dispatch('start', this.dataResolved, this.eventMeta)
        this.state = 'RUNNING/PROCESSING'
        const result = await this.node.process(this.context)
        if (result) this.resolveResult(result)
      }

      // --- End the node execution and dispatch the end event.
      this.state = 'DONE'
      this.dispatch('end', this.dataResolved, this.result, this.eventMeta)
    }

    // --- If an error occurs, dispatch the error event so that listeners
    // --- can handle the error and take appropriate action.
    catch (error) {
      this.error = error as Error
      this.dispatch('error', error as Error, this.eventMeta)
      this.state = 'IDLE'
    }

    // --- Reset the execution ID and increment the execution index.
    this.executionId = randomUUID() as string
    this.executionStart = Date.now()
    this.executionIndex++
    return this.result
  }

  /**
   * Abort the node by triggering the abort signal. The abort signal is passed
   * to the `process` function of the node and can be used to cancel pending
   * operations. Additionally, the abort controller is reset to create a new
   * abort signal for the next execution of the node.
   *
   * @param error The error that caused the node to be aborted.
   */
  public abort(error?: Error): void {
    if (!error) error = new Error('Node execution was aborted')
    this.abortController.abort(error)
    this.abortController = new AbortController()
    this.dispatch('abort', this.eventMeta)
  }

  public reset(): void {
    this.state = 'IDLE'
    this.result = {} as ResultFromSchema<U>
    this.dataParseErrors = {}
    this.resultParseErrors = {}
  }

  /** Destroy the instance by aborting the node and removing all event listeners. */
  public destroy() {
    this.state = 'DESTROYED'
    this.abort()
    for (const [event, handler] of this.eventHandlers)
      this.eventTarget.removeEventListener(event, handler)
    this.eventHandlers = []
  }

  /** @internal */
  [Symbol.dispose]() {
    this.destroy()
  }
}

/**
 * Create a new node instance with the given node and options.
 *
 * @param node The node to create an instance of.
 * @param options The options to use when creating the node instance.
 * @returns A new node instance.
 */
export function createNodeInstance<T extends DataSchema = DataSchema, U extends ResultSchema = ResultSchema>(
  node: Node<string, T, U>,
  options: NodeInstanceOptions<T, U> = {},
): NodeInstance<T, U> {
  return new NodeInstance(node, options)
}
