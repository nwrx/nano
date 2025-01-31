import type { Flow } from './createFlow'
import type { DataFromSchema, DataSchema } from './defineDataSchema'
import type { Node, NodeInstanceContext } from './defineNode'
import type { ResultFromSchema, ResultSchema } from './defineResultSchema'
import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'

const PREFIX_VARIABLE = '$VARIABLE.'
const PREFIX_SECRET = '$SECRET.'
const PREFIX_NODE = '$NODE.'

export interface NodeEventMeta {
  executionId: string
  threadId: string
  delta: number
  duration: number
  timestamp: number
}

export interface NodeMeta {
  label?: string
  comment?: string
  position?: { x: number; y: number }
  isCollapsed?: boolean
  isDisabled?: boolean
  [key: string]: unknown
}

export interface NodeEvents<T extends DataSchema, U extends ResultSchema> {
  meta: [key: string, value: unknown]
  data: [data: Record<string, unknown>]
  result: [result: ResultFromSchema<U>]
  dataSchema: [schema: T]
  resultSchema: [schema: U]
  start: [data: DataFromSchema<T>, meta: NodeEventMeta]
  end: [data: DataFromSchema<T>, result: ResultFromSchema<U>, meta: NodeEventMeta]
  error: [error: Error, meta: NodeEventMeta]
  abort: [meta: NodeEventMeta]
}

export type NodeListener<T extends DataSchema, U extends ResultSchema, K extends keyof NodeEvents<T, U>> =
  (...parameters: NodeEvents<T, U>[K]) => Promise<void> | void

export interface NodeInstanceOptions<T extends DataSchema = DataSchema, U extends ResultSchema = ResultSchema> {
  id?: string
  node: Node<string, T, U>
  meta?: NodeMeta
  initialData?: Partial<DataFromSchema<T>>
  initialResult?: Partial<ResultFromSchema<U>>
}

export class NodeInstance<T extends DataSchema = DataSchema, U extends ResultSchema = ResultSchema> implements NodeInstanceOptions<T, U> {
  constructor(public flow: Flow, options: NodeInstanceOptions<T, U>) {
    this.node = options.node
    if (options.id) this.id = options.id
    if (options.meta) this.meta = options.meta
    if (options.initialData) this.data = { ...options.initialData }
    if (options.initialResult) this.result = { ...options.initialResult } as DataFromSchema<U>
    this.dataSchema = (typeof this.node.dataSchema === 'function' ? {} : this.node.dataSchema) as T
    this.resultSchema = (typeof this.node.resultSchema === 'function' ? {} : this.node.resultSchema) as U
  }

  public id = randomUUID() as string
  public node
  public meta: NodeMeta = {}

  public isDone = false
  public isRunning = false
  public isDestroyed = false
  public isProcessing = false
  public errors: Error[] = []

  public executionId = randomUUID() as string
  public executionStart = Date.now()
  public executionIndex = 0

  public data = {} as Record<string, unknown>
  public dataResolved = {} as DataFromSchema<T>
  public dataSchema: T
  public result = {} as DataFromSchema<U>
  public resultSchema: U

  public eventTarget = new EventTarget()
  public eventHandlers: Array<[event: string, handler: EventListener]> = []
  public abortController = new AbortController()

  /***************************************************************************/
  /* Private methods                                                         */
  /***************************************************************************/

  private get eventMeta(): NodeEventMeta {
    return {
      executionId: this.executionId,
      threadId: this.flow.threadId,
      delta: Date.now() - this.executionStart,
      duration: Date.now() - this.executionStart,
      timestamp: Date.now(),
    }
  }

  private get context(): NodeInstanceContext<T, U> {
    return {
      data: this.dataResolved,
      result: this.result,
      abortSignal: this.abortController.signal,
    } as NodeInstanceContext<T, U>
  }

  private dispatch<K extends keyof NodeEvents<T, U>>(event: K, ...data: NodeEvents<T, U>[K]) {
    const customEvent = new CustomEvent(event as string, { detail: data })
    this.eventTarget.dispatchEvent(customEvent)
  }

  private async resolveDataSchema(): Promise<T> {
    try {
      if (typeof this.node.dataSchema !== 'function') return this.dataSchema
      this.dataSchema = await this.node.dataSchema(this.context)
      this.dispatch('dataSchema', this.dataSchema)
      return this.dataSchema
    }
    catch (error) {
      this.dispatch('error', error as Error, this.eventMeta)
      return this.dataSchema
    }
  }

  private async resolveResultSchema(): Promise<U> {
    try {
      if (typeof this.node.resultSchema !== 'function') return this.resultSchema
      this.resultSchema = await this.node.resultSchema(this.context)
      this.dispatch('resultSchema', this.resultSchema)
      return this.resultSchema
    }
    catch (error) {
      this.dispatch('error', error as Error, this.eventMeta)
      return this.resultSchema
    }
  }

  private async resolveDataValue(key: string): Promise<unknown> {

    // --- Get the parser for the data property.
    const raw = this.data[key]
    const socket = this.dataSchema[key]
    if (!socket) return
    const parse = socket.type.parse as (value: unknown) => unknown

    // --- If value is undefined and the socket is optional, return the default value.
    if (raw === undefined && socket.isOptional)
      return socket.defaultValue

    // --- Anything other than a string is considered to be a final value.
    if (typeof raw !== 'string') return parse(raw)

    // --- If the value is a variable, get the value of the variable.
    if (raw.startsWith(PREFIX_VARIABLE)) {
      const name = raw.slice(PREFIX_VARIABLE.length)
      const value = await this.flow.resolveVariable?.(name)
      if (!value) throw new Error(`Variable "${name}" does not exist or is not accessible`)
      return parse(value)
    }

    // --- If the value is a secret, get the value of the secret.
    else if (raw.startsWith(PREFIX_SECRET)) {
      const name = raw.slice(PREFIX_SECRET.length)
      const value = await this.flow.resolveSecret?.(name)
      if (!value) throw new Error(`Secret "${name}" does not exist or is not accessible`)
      return parse(value)
    }

    // --- If the value is a result of another node, resolve it's value.
    else if (raw.startsWith(PREFIX_NODE)) {
      const [id, key] = raw.slice(PREFIX_NODE.length).split(':')
      const node = this.flow.get(id)
      if (!node.isDone) return
      const value = node.result[key]
      return parse(value)
    }

    // --- Otherwise, parse and return the value as is.
    return parse(raw)
  }

  private async resolveData(): Promise<void> {
    const data = {} as Record<string, unknown>
    for (const key in this.dataSchema) {
      try {
        data[key] = await this.resolveDataValue(key)
      }
      catch (error) {
        (error as Error).message = `Failed to resolve "${key}": ${(error as Error).message}`
        this.dispatch('error', error as Error, this.eventMeta)
      }
    }
    this.dataResolved = data as DataFromSchema<T>
  }

  private setResult(result: DataFromSchema<U>): void {
    const finalResult: Record<string, unknown> = {}
    for (const key in this.resultSchema) {
      try {
        const value = result[key]
        const socket = this.resultSchema[key]
        if (value === undefined && socket.isOptional) continue
        const parse = this.resultSchema[key].type.parse
        finalResult[key] = parse(value)
      }
      catch (_error) {
        const error = _error instanceof ValidationError ? _error : new Error(_error as string)
        const message = `Unexpected result on "${this.id}/${key}"`
        error.message = `${message}: ${error.message}`
        this.dispatch('error', error, this.eventMeta)
        console.warn(error)
        finalResult[key] = undefined
      }
    }
    this.result = finalResult as DataFromSchema<U>
    this.dispatch('result', this.result)
  }

  /***************************************************************************/
  /* Public methods                                                          */
  /***************************************************************************/

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
    this.dispatch('meta', key, value)
  }

  /**
   * Set the value of a data property of the node by key.
   *
   * @param key The key of the data property.
   * @param value The value of the data property.
   */
  public setDataValue<K extends keyof T>(key: K, value: DataFromSchema<T>[K]): void {
    this.data[key as string] = value
    this.dispatch('data', this.data)
  }

  /**
   * Refresh the data schema, the result schema, and the data of the node.
   *
   * @returns A promise that resolves when the node is initialized.
   * @example
   * // Create a new flow with a single node.
   * using flow = createFlow()
   * const node = flow.add(...)
   *
   * // Initialize the node before starting it.
   * await node.refresh()
   */
  public async refresh(): Promise<void> {
    await this.resolveData()
    await this.resolveResultSchema()
    await this.resolveDataSchema()
  }

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
    try {
      if (this.isRunning) throw new Error('The node is already running')
      if (this.isDestroyed) throw new Error('The node has been destroyed')

      // --- Initialize and resolve the data schema and the result schema.
      this.isRunning = true
      await this.refresh()

      // --- Process the node by calling the process function of the node.
      this.dispatch('start', this.dataResolved, this.eventMeta)
      this.isProcessing = true
      const result = await this.node.process?.(this.context)
      if (result) this.setResult(result)
      this.dispatch('end', this.dataResolved, this.result, this.eventMeta)
      this.isDone = true
    }

    // --- If an error occurs, dispatch the error event so that listeners
    // --- can handle the error and take appropriate action.
    catch (error) {
      this.dispatch('error', error as Error, this.eventMeta)
    }

    // --- Finally, dispatch the end event to notify listeners that the
    // --- node has finished processing and is no longer running.
    finally {
      this.isRunning = false
      this.isProcessing = false
      this.executionId = randomUUID() as string
      this.executionStart = Date.now()
      this.executionIndex++
    }
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

  /** Destroy the instance by aborting the node and removing all event listeners. */
  public destroy() {
    this.isDestroyed = true
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
 * Create a new flow node instance based on the given options. The flow node
 * instance is created with the given flow, node, position, initial data, and
 * initial result.
 *
 * @param flow The flow to create the flow node instance with.
 * @param options The options to create the flow node instance with.
 * @returns The flow node instance created with the given options.
 */
export function createNodeInstance<
  T extends DataSchema,
  U extends ResultSchema,
>(flow: Flow, options: NodeInstanceOptions<T, U>) {
  return new NodeInstance(flow, options)
}
