import type { Flow } from './createFlow'
import type { DataFromSchema, DataSchema } from './defineDataSchema'
import type { Node, NodeInstanceContext } from './defineNode'
import type { ResultFromSchema, ResultSchema } from './defineResultSchema'
import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'

const REFERENCE_EXP = /^\$(?<type>[A-Z]+)\.(?<name>[\w-/]+)$/

export type NodeState =
  | 'DESTROYED'
  | 'DONE'
  | 'IDLE'
  | 'RUNNING/PROCESSING'
  | 'RUNNING/RESOLVING_DATA'
  | 'RUNNING/RESOLVING_DATA_SCHEMA'
  | 'RUNNING/RESOLVING_RESULT_SCHEMA'

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
  public meta = {} as NodeMeta
  public flow: Flow | undefined
  public error: Error | undefined

  public data = {} as Record<string, unknown>
  public dataSchema = {} as T
  public dataResolved = {} as DataFromSchema<T>
  public dataParseErrors: Record<string, Error> = {}

  public result = {} as ResultFromSchema<U>
  public resultSchema = {} as U
  public resultParseErrors: Record<string, Error> = {}

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
  private eventTarget = new EventTarget()
  private eventHandlers: Array<[event: string, handler: EventListener]> = []
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

  private get context(): NodeInstanceContext<T, U> {
    return {
      data: { ...this.data, ...this.dataResolved },
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
      this.state = 'RUNNING/RESOLVING_DATA_SCHEMA'
      this.dataSchema = await this.node.dataSchema(this.context)
      this.dispatch('dataSchema', this.dataSchema, this.eventMeta)
      return this.dataSchema
    }
    catch (error) {
      this.state = 'IDLE'
      this.error = error as Error
      this.dispatch('error', error as Error, this.eventMeta)
      return this.dataSchema
    }
  }

  private async resolveResultSchema(): Promise<U> {
    try {
      if (typeof this.node.resultSchema !== 'function') return this.resultSchema
      this.state = 'RUNNING/RESOLVING_DATA_SCHEMA'
      this.resultSchema = await this.node.resultSchema(this.context)
      this.dispatch('resultSchema', this.resultSchema, this.eventMeta)
      return this.resultSchema
    }
    catch (error) {
      this.state = 'IDLE'
      this.error = error as Error
      this.dispatch('error', error as Error, this.eventMeta)
      return this.resultSchema
    }
  }

  private async resolveData(): Promise<boolean> {
    this.state = 'RUNNING/RESOLVING_DATA'
    const dataResolved = {} as Record<string, unknown>
    const dataErrors = {} as Record<string, Error>
    let isReady = true

    const keys = [
      ...Object.keys(this.dataSchema),
      ...Object.keys(this.data),
    ]

    // --- Get the parser for the data property.
    for (const key of keys) {
      try {
        let value = this.data[key]
        const socket = this.dataSchema[key]

        // --- Skip properties not present in schema.
        if (!socket) {
          dataResolved[key] = value
          continue
        }

        // --- Value from reference.
        if (typeof value === 'string' && REFERENCE_EXP.test(value)) {
          if (!this.resolveReference) throw new Error('Reference resolver is not defined')
          const { type, name } = REFERENCE_EXP.exec(value)!.groups!
          value = await this.resolveReference(type, name)
        }

        // --- Missing or undefined value.
        if (value === undefined && !socket.isOptional)
          isReady = false

        // --- Value from raw data.
        dataResolved[key] = value === undefined
          ? socket.defaultValue
          :socket.type.parse(value)
      }
      catch (error) {
        dataErrors[key] = error as Error
        this.dispatch('dataParseError', key, error as Error, this.eventMeta)
        this.dispatch('error', error as Error, this.eventMeta)
        isReady = false
      }
    }

    // --- Set the resolved data and return it.
    this.dataParseErrors = dataErrors
    this.dataResolved = dataResolved as DataFromSchema<T>
    this.state = 'IDLE'
    return isReady
  }

  private setResult(result: DataFromSchema<U>): void {
    const resultFinal: Record<string, unknown> = {}
    const resultErrors: Record<string, Error> = {}

    for (const key in this.resultSchema) {
      try {
        const value = result[key]
        const socket = this.resultSchema[key]
        if (value === undefined && socket.isOptional) continue
        const parse = this.resultSchema[key].type.parse
        resultFinal[key] = parse(value)
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
    this.result = resultFinal as DataFromSchema<U>
    this.dispatch('result', this.result, this.eventMeta)
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
    this.dispatch('meta', key, value, this.eventMeta)
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

  /**
   * The `dataSchema` or `resultSchema` of the node can be a function that returns
   * the schema based on the context of the node. This function can be called to
   * refresh the schema of the node based on the current context.
   *
   * Additionally, the `data` property of the node can contain special values such
   * as `$VARIABLE.<name>`, `$SECRET.<name>`, and `$NODE.<id>:<key>`. These values
   * are resolved when the node is refreshed.
   *
   * @returns A promise that resolves to `true` if the node is ready to be processed.
   * @example
   * // Create a new flow with a single node.
   * using flow = createFlow()
   * const node = await flow.add(..., { initialData: {
   *  valueFromVariable: '$VARIABLE.MY_VARIABLE',
   *  valueFromSecret: '$SECRET.MY_SUPER_SECRET',
   *  valueFromNode: '$NODE.math-add:sum'
   * }})
   *
   * // Refresh the node to resolve the data properties.
   * await node.refresh()
   * console.log(node.dataResolved)
   * // {
   * //   valueFromVariable: 'value of the MY_VARIABLE variable',
   * //   valueFromSecret: 'value of the MY_SUPER_SECRET secret',
   * //   valueFromNode: 'The result of the math-add node with the key "sum"'
   * // }
   */
  public async refresh(): Promise<boolean> {
    await this.resolveDataSchema()
    await this.resolveResultSchema()
    return this.resolveData()
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
    if (this.state === 'DESTROYED') throw new Error('Node has been destroyed')
    if (this.state.startsWith('RUNNING')) throw new Error('Node is already running')

    // --- Initialize and resolve the data schema and the result schema.
    try {
      const isReady = await this.refresh()
      if (!isReady) {
        this.state = 'IDLE'
        return
      }

      // --- Process the node by calling the process function of the node.
      this.dispatch('start', this.dataResolved, this.eventMeta)
      this.state = 'RUNNING/PROCESSING'
      const result = await this.node.process?.(this.context)
      if (result) this.setResult(result)
      this.dispatch('end', this.dataResolved, this.result, this.eventMeta)
      this.state = 'DONE'
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
