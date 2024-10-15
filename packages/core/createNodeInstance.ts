import type { MaybeLiteral } from '@unshared/types'
import type { Flow } from './createFlow'
import type { DataFromSchema, DataSchema } from './defineDataSchema'
import type { Node, NodeInstanceContext } from './defineNode'
import type { ResultFromSchema, ResultSchema } from './defineResultSchema'
import { randomUUID } from 'node:crypto'

/**
 * A map of events that can be dispatched by a flow node and the variables
 * that are passed to the event listeners.
 */
export interface NodeEvents<T extends DataSchema, U extends ResultSchema> {
  meta: [meta: NodeInstanceMeta]
  metaValue: [key: string, value: unknown]
  data: [data: DataFromSchema<T>]
  dataRaw: [data: Record<string, unknown>]
  result: [result: ResultFromSchema<U>]
  dataSchema: [schema: T]
  resultSchema: [schema: U]
  start: []
  abort: []
  end: []
  reset: []
  error: [error: Error]
}

/**
 * A listener for a flow node event. The listener is called when the event is
 * dispatched by the flow node.
 */
export type NodeListener<T extends DataSchema, U extends ResultSchema, K extends keyof NodeEvents<T, U>> =
  (...parameters: NodeEvents<T, U>[K]) => Promise<void> | void

/**
 * Additional properties that can be set on a flow node instance. They are used to
 * provide additional information about the node instance, such as a label, a comment,
 * a position, and other meta information that are context-specific.
 */
export interface NodeInstanceMeta {
  label?: string
  comment?: string
  position?: { x: number; y: number }
  isCollapsed?: boolean
  isDisabled?: boolean
  [key: string]: unknown
}

/**
 * The options that are used to define a flow node. The options contain the flow
 * that the node is part of, the node definition, the initial data, and the initial
 * result of the node.
 *
 * @template T The schema of the data that the node expects.
 * @template U The schema of the result that the node produces.
 */
export interface NodeInstanceOptions<T extends DataSchema, U extends ResultSchema> {
  id?: string
  flow: Flow
  node: Node<string, T, U>
  meta?: NodeInstanceMeta
  initialData?: Partial<DataFromSchema<T>>
  initialResult?: Partial<ResultFromSchema<U>>
}

/**
 * A flow node that can be used in a flow to process data.
 * It is the basic building block of a flow that can be connected to other
 * nodes to create a flow of nodes that process data in a sequence.
 *
 * @example new ChainNode({ id: 'core:entrypoint', name: 'Entrypoint' })
 */
export class NodeInstance<
  T extends DataSchema = DataSchema,
  U extends ResultSchema = ResultSchema,
> implements NodeInstanceOptions<T, U> {
  constructor(options: NodeInstanceOptions<T, U>) {
    this.flow = options.flow
    this.node = options.node
    if (options.id) this.id = options.id
    if (options.meta) this.meta = options.meta
    this.dataRaw = { ...options.initialData }
    this.result = { ...options.initialResult } as DataFromSchema<U>
    this.dataSchema = (typeof this.node.dataSchema === 'function' ? {} : this.node.dataSchema) as T
    this.resultSchema = (typeof this.node.resultSchema === 'function' ? {} : this.node.resultSchema) as U
  }

  public flow
  public node
  public meta: NodeInstanceMeta = {}
  public id = randomUUID() as string

  public error: Error | undefined
  public dataRaw = {} as Record<string, unknown>
  public result = {} as DataFromSchema<U>
  public dataSchema: T
  public resultSchema: U

  public isRunning = false
  public eventTarget = new EventTarget()
  public eventHandlers = new Map<string, EventListener>()
  public abortController = new AbortController()

  /**
   * Dispatch an event to the node. The event is dispatched to all nodes in
   * the flow.
   *
   * @param event The event to dispatch.
   * @param data The parameters to pass to the event listeners.
   */
  public dispatch<K extends keyof NodeEvents<T, U>>(event: K, ...data: NodeEvents<T, U>[K]) {
    const customEvent = new CustomEvent(event as string, { detail: data })
    this.eventTarget.dispatchEvent(customEvent)
  }

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
    this.eventHandlers.set(event, handler)
    return () => this.eventTarget.removeEventListener(event, handler)
  }

  /**
   * Set the settings of the flow. This includes the name, icon and description of
   * the flow that are displayed in the UI. Once called, an event is dispatched
   * to notify listeners that the settings have been updated.
   *
   * @param meta The settings to set for the flow.
   * @example flow.flowSetMeta({ name: 'Flow', icon: 'flow', description: 'A flow' })
   */
  public setMeta(meta: Partial<NodeInstanceMeta>) {
    this.meta = { ...this.meta, ...meta }
    this.dispatch('meta', this.meta)
  }

  /**
   * Set a specific value in the meta object of the flow. This allows us to reduce
   * the payload size when sending updates to the client by only sending the updated
   * value instead of the entire meta object.
   *
   * @param key The key of the value to set in the meta object.
   * @param value The value to set in the meta object.
   */
  public setMetaValue(key: string, value: unknown) {
    this.meta = { ...this.meta, [key]: value }
    this.dispatch('metaValue', key, value)
  }

  /**
   * Resolve the schema of the data that the node expects. If the schema is
   * already resolved, the resolved schema is returned. Otherwise, the given
   * `dataSchema` function is called to resolve the schema and the schema
   * is stored in the state.
   *
   * @returns The schema of the data that the node expects.
   */
  public async resolveDataSchema(): Promise<T> {
    try {
      if (typeof this.node.dataSchema !== 'function') return this.dataSchema
      this.dataSchema = await this.node.dataSchema(this.context)
      this.dispatch('dataSchema', this.dataSchema)
      return this.dataSchema
    }
    catch (error) {
      this.dispatch('error', error as Error)
      return this.dataSchema
    }
  }

  /**
   * Resolve the schema of the result that the node produces. If the schema is
   * already resolved, the resolved schema is returned. Otherwise, the given
   * `defineResultSchema` function is called to resolve the schema and the schema
   * is stored in the state.
   *
   * @returns The schema of the result that the node produces.
   */
  public async resolveResultSchema(): Promise<U> {
    try {
      if (typeof this.node.resultSchema !== 'function') return this.resultSchema
      this.resultSchema = await this.node.resultSchema(this.context)
      this.dispatch('resultSchema', this.resultSchema)
      return this.resultSchema
    }
    catch (error) {
      this.dispatch('error', error as Error)
      return this.resultSchema
    }
  }

  /**
   * Given a key, get the `ChainNodePort` that corresponds to the key of
   * the data schema.
   *
   * @param key The key of the data schema to get the port for.
   * @returns The port that corresponds to the key of the data schema.
   */
  public getDataSocket<K extends keyof T>(key: K): T[K] {
    if (key in this.dataSchema) return this.dataSchema[key]
    throw new Error(`The data schema of node "${this.id}" does not contain a port with the key "${key as string}" or has not been resolved yet`)
  }

  /**
   * Set the value of a data property of the node by key.
   *
   * @param key The key of the data property.
   * @param value The value of the data property.
   */
  public setDataValue<K extends keyof T>(key: K, value: DataFromSchema<T>[K]): void {
    this.getDataSocket(key)
    this.dataRaw[key as string] = value
    this.dispatch('data', this.data)
    this.dispatch('dataRaw', this.dataRaw)
  }

  /**
   * Set the data of the node.
   *
   * @param data The data to set.
   */
  public setData(data: DataFromSchema<T>): void {
    for (const key in data) this.getDataSocket(key)
    this.dataRaw = data
    this.dispatch('data', this.data)
    this.dispatch('dataRaw', this.dataRaw)
  }

  /**
   * Given a key, get the `ChainNodePort` that corresponds to the key of
   * the result schema.
   *
   * @param key The key of the result schema to get the port for.
   * @returns The port that corresponds to the key of the result schema.
   */
  public getResultSocket<K extends keyof U>(key: K): U[K] {
    if (key in this.resultSchema) return this.resultSchema[key]
    throw new Error(`The result schema of node "${this.id}" does not contain a port with the key "${key as string}" or has not been resolved yet`)
  }

  /**
   * Given a key, get the value of the result of the node by key.
   * If the key does not exist in the result, an error is thrown.
   *
   * @param key The key of the result property to get.
   * @returns The value of the result property of the node by key.
   */
  public getResultValue<K extends keyof U>(key: K): ResultFromSchema<U>[K] {
    this.getResultSocket(key)
    return this.result[key]
  }

  /**
   * Set a property of the result of the node by key.
   *
   * @param key The key of the result property.
   * @param value The value of the result property.
   */
  public setResultValue<K extends keyof U>(key: K, value: ResultFromSchema<U>[K]): void {
    const port = this.getResultSocket(key)
    this.result[key] = port.type.parse(value) as ResultFromSchema<U>[K]
    this.dispatch('result', this.result)
  }

  /**
   * Set the result of the node.
   *
   * @param result The result to set.
   */
  public setResult(result: DataFromSchema<U>): void {
    if (!this.resultSchema) throw new Error('Cannot set the result of the node before the result schema has been resolved')
    const newResult: Record<string, unknown> = {}
    for (const key in this.resultSchema)
      newResult[key] = this.resultSchema[key].type.parse(result[key])
    this.result = newResult as DataFromSchema<U>
    this.dispatch('result', this.result)
  }

  /**
   * Clear the result of the node by resetting the result to an empty object.
   * This is used when restarting the node and avoiding side effects from the
   * previous execution of the node.
   *
   * @example node.reset()
   */
  public reset() {
    this.result = {} as DataFromSchema<U>
    this.dispatch('reset')
  }

  /**
   * Resolve the data value of the node by key. The data value is resolved by
   * extracting variables or secrets from the flow or by getting the result
   * of another node in the flow.
   *
   * @param key The key of the data property to resolve.
   * @returns The resolved data value of the node by key.
   */
  public resolveDataValue<K extends keyof DataFromSchema<T>>(key: MaybeLiteral<K & string>): DataFromSchema<T>[K] | undefined {

    // --- Get the parser for the data property.
    const raw = this.dataRaw[key]
    const socket = this.dataSchema[key]
    if (!socket) return
    const parse = socket.type.parse as (value: unknown) => DataFromSchema<T>[K]

    // --- If the value is a variable, get the value of the variable.
    if (typeof raw === 'string' && raw.startsWith('$VARIABLE.')) {
      const name = raw.slice(10)
      return parse(this.flow.variables[name])
    }

    // --- If the value is a secret, get the value of the secret.
    else if (typeof raw === 'string' && raw.startsWith('$SECRET.')) {
      const name = raw.slice(8)
      const result = this.flow.secrets[name]
      return parse(result)
    }

    // --- If the value is a result of another node, resolve it's value.
    if (typeof raw === 'string' && raw.startsWith('$NODE.')) {
      const [node, key] = raw.slice(6).split(':')
      const result = this.flow.getNodeInstance(node).getResultValue(key)
      return parse(result)
    }

    // --- Otherwise, parse and return the value as is.
    return parse(raw)
  }

  /**
   * A proxy object that is used to access the data of the node. The proxy
   * object is used to resolve the data value of the node by key.
   *
   * @returns A proxy object that is used to access the data of the node.
   */
  public get data(): DataFromSchema<T> {
    // eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
    const that = this
    return new Proxy(this.dataRaw, {
      get(_, key: keyof T & string) { return that.resolveDataValue(key) },
    }) as DataFromSchema<T>
  }

  /**
   * Return the context object that is used to process the node. The context
   * object contains the data, the secrets, variables and the abort signal.
   * The context object is passed to the `process` function of the node.
   *
   * @returns The context object that is used to process the node.
   */
  public get context(): NodeInstanceContext<T, U> {
    return {
      flow: this.flow,
      data: this.data as NodeInstanceContext<T, U>['data'],
      result: this.result as NodeInstanceContext<T, U>['result'],
      dataSchema: this.dataSchema,
      resultSchema: this.resultSchema,
      secrets: this.flow.secrets,
      variables: this.flow.variables,
      abortSignal: this.abortController.signal,
    }
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
    this.dispatch('abort')
  }

  /**
   * Process the node by calling the `process` function of the node with the
   * context of the node. The context contains the data, the secrets, the
   * variables, and the abort signal.
   *
   * @example
   *
   * // Create a new flow with a single node.
   * using flow = createFlow({ modules: [Core] })
   * const node = flow.node('core:parse-json', { initialData: { json: '{"key": "value"}' } })
   *
   * // Start processing the node right away.
   * node.process()
   */
  public async process(): Promise<void> {
    if (!this.node.process) return
    try {
      // await this.resolveDataSchema()
      // await this.resolveResultSchema()

      // --- Assert that all the required data properties are set.
      for (const key in this.dataSchema) {
        const { isOptional } = this.dataSchema[key]
        const value = this.data[key]
        if (isOptional && value === undefined) return
      }

      this.isRunning = true
      this.dispatch('start')
      const result = await this.node.process(this.context)
      if (result) this.setResult(result)
    }

    // --- If an error occurs, dispatch the error event so that listeners
    // --- can handle the error and take appropriate action.
    catch (error) {
      this.dispatch('error', error as Error)
    }

    // --- Finally, dispatch the end event to notify listeners that the
    // --- node has finished processing and is no longer running.
    finally {
      this.isRunning = false
      this.dispatch('end')
    }
  }

  /**
   * Destroy the node by removing all event listeners and stopping any
   * pending operations by triggering the abort signal.
   */
  public destroy() {
    this.abort()
    for (const [event, handler] of this.eventHandlers)
      this.eventTarget.removeEventListener(event, handler)
    this.eventHandlers.clear()
  }

  /**
   * Dispose of the node by removing all event listeners and stopping any
   * pending operations by triggering the abort signal.
   */
  [Symbol.dispose]() {
    this.destroy()
  }
}

/**
 * Create a new flow node instance based on the given options. The flow node
 * instance is created with the given flow, node, position, initial data, and
 * initial result.
 *
 * @param options The options to create the flow node instance with.
 * @returns The flow node instance created with the given options.
 */
export function createFlowNodeInstance<
  T extends DataSchema,
  U extends ResultSchema,
>(options: NodeInstanceOptions<T, U>): NodeInstance<T, U> {
  return new NodeInstance(options)
}
