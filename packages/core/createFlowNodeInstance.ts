import type { Pretty } from '@unshared/types'
import type { Flow } from './createFlow'
import type { FlowNode, FlowNodeContext } from './defineFlowNode'
import type {
  InferData,
  InferDataKeys,
  InferDataSchema,
  InferDataValue,
  InferResult,
  InferResultKeys,
  InferResultSchema,
  InferResultValue,
} from './types'
import { randomUUID } from 'node:crypto'
import { createSchemaParser } from './createSchemaParser'

/**
 * A map of events that can be dispatched by a flow node and the variables
 * that are passed to the event listeners.
 */
export interface FlowNodeEvents<T extends FlowNode> {
  meta: [meta: Partial<FlowNodeInstanceMeta>]
  metaValue: [key: string, value: unknown]
  data: [data: Record<string, unknown>]
  result: [result: Partial<InferResult<T>>]
  dataSchema: [schema: InferDataSchema<T>]
  resultSchema: [schema: InferResultSchema<T>]
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
export type FlowNodeListener<T extends FlowNode, K extends keyof FlowNodeEvents<T>> =
  (...parameters: FlowNodeEvents<T>[K]) => Promise<void> | void

/**
 * Additional properties that can be set on a flow node instance. They are used to
 * provide additional information about the node instance, such as a label, a comment,
 * a position, and other meta information that are context-specific.
 */
export interface FlowNodeInstanceMeta {
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
export interface FlowNodeInstanceOptions<T extends FlowNode = FlowNode> {
  id?: string
  flow: Flow
  node: T
  meta?: FlowNodeInstanceMeta
  initialData?: Partial<InferData<T>>
  initialResult?: Partial<InferResult<T>>
}

/**
 * A flow node that can be used in a flow to process data.
 * It is the basic building block of a flow that can be connected to other
 * nodes to create a flow of nodes that process data in a sequence.
 *
 * @example new ChainNode({ id: 'core:entrypoint', name: 'Entrypoint' })
 */
export class FlowNodeInstance<T extends FlowNode = FlowNode> implements FlowNodeInstanceOptions<T> {
  constructor(options: FlowNodeInstanceOptions<T>) {
    this.flow = options.flow
    this.node = options.node
    if (options.id) this.id = options.id
    if (options.meta) this.meta = options.meta
    this.dataRaw = { ...options.initialData } as InferData<T>
    this.result = { ...options.initialResult } as InferResult<T>
    this.dataSchema = (typeof this.node.defineDataSchema === 'function' ? {} : this.node.defineDataSchema) as InferDataSchema<T>
    this.resultSchema = (typeof this.node.defineResultSchema === 'function' ? {} : this.node.defineResultSchema) as InferResultSchema<T>
  }

  public flow
  public node
  public meta: FlowNodeInstanceMeta = {}
  public id = randomUUID() as string

  public error: Error | undefined
  public dataRaw = {} as Record<string, unknown>
  public result = {} as Partial<InferResult<T>>
  public dataSchema: InferDataSchema<T>
  public resultSchema: InferResultSchema<T>

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
  public dispatch<K extends keyof FlowNodeEvents<T>>(event: K, ...data: FlowNodeEvents<T>[K]) {
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
  public on<K extends keyof FlowNodeEvents<T>>(event: K, listener: FlowNodeListener<T, K>): () => void {
    const handler = (event: Event) => { void listener(...(event as CustomEvent<FlowNodeEvents<T>[K]>).detail) }
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
  public setMeta(meta: Partial<FlowNodeInstanceMeta>) {
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
   * `defineDataSchema` function is called to resolve the schema and the schema
   * is stored in the state.
   *
   * @returns The schema of the data that the node expects.
   */
  public async resolveDataSchema(): Promise<InferDataSchema<T>> {
    try {
      if (typeof this.node.defineDataSchema !== 'function') return this.dataSchema
      this.dataSchema = await this.node.defineDataSchema(this.context) as InferDataSchema<T>
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
  public async resolveResultSchema(): Promise<InferResultSchema<T>> {
    try {
      if (typeof this.node.defineResultSchema !== 'function') return this.resultSchema
      this.resultSchema = await this.node.defineResultSchema(this.context) as InferResultSchema<T>
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
  public getDataPort<K extends InferDataKeys<T>>(key: K): InferDataSchema<T>[K] {
    if (key in this.dataSchema) return this.dataSchema[key]
    throw new Error(`The data schema of node "${this.id}" does not contain a port with the key "${key}" or has not been resolved yet`)
  }

  /**
   * Set the value of a data property of the node by key.
   *
   * @param key The key of the data property.
   * @param value The value of the data property.
   */
  public setDataValue<K extends InferDataKeys<T>>(key: K, value: InferDataValue<T, K>): void {
    this.getDataPort(key)
    this.dataRaw[key] = value
    this.dispatch('data', this.dataRaw)
  }

  /**
   * Set the data of the node.
   *
   * @param data The data to set.
   */
  public setData(data: InferData<T>): void {
    for (const key in data) this.getDataPort(key)
    this.dataRaw = data
    this.dispatch('data', this.dataRaw)
  }

  /**
   * Given a key, get the `ChainNodePort` that corresponds to the key of
   * the result schema.
   *
   * @param key The key of the result schema to get the port for.
   * @returns The port that corresponds to the key of the result schema.
   */
  public getResultPort<K extends InferResultKeys<T>>(key: K): InferResultSchema<T>[K] {
    if (key in this.resultSchema) return this.resultSchema[key]
    throw new Error(`The result schema of node "${this.id}" does not contain a port with the key "${key}" or has not been resolved yet`)
  }

  /**
   * Given a key, get the value of the result of the node by key.
   * If the key does not exist in the result, an error is thrown.
   *
   * @param key The key of the result property to get.
   * @returns The value of the result property of the node by key.
   */
  public getResultValue<K extends InferResultKeys<T>>(key: K): InferResultValue<T, K> {
    this.getResultPort(key)
    return this.result[key] as InferResultValue<T, K>
  }

  /**
   * Set a property of the result of the node by key.
   *
   * @param key The key of the result property.
   * @param value The value of the result property.
   */
  public setResultValue<K extends InferResultKeys<T>>(key: K, value: InferResultValue<T, K>): void {
    const port = this.getResultPort(key)
    this.result[key] = port.type.parse(value) as InferResultValue<T, K>
    this.dispatch('result', this.result)
  }

  /**
   * Set the result of the node.
   *
   * @param result The result to set.
   */
  public setResult(result: InferResult<T>): void {
    if (!this.resultSchema) throw new Error('Result schema not resolved')
    const parse = createSchemaParser(this.resultSchema)
    this.result = parse(result)
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
    this.result = {} as InferResult<T>
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
  public resolveDataValue<K extends InferDataKeys<T>>(key: K): InferDataValue<T, K> | undefined {
    const value = this.dataRaw[key]
    if (value === undefined) return

    // --- Get the parser for the data property.
    const parse = key in this.dataSchema
      ? this.dataSchema[key].type.parse as (value: unknown) => InferDataValue<T, K>
      : () => undefined as InferDataValue<T, K>

    // --- If the value is a variable, get the value of the variable.
    if (typeof value === 'string' && value.startsWith('$VARIABLE.')) {
      const name = value.slice(10)
      return parse(this.flow.variables[name])
    }

    // --- If the value is a secret, get the value of the secret.
    else if (typeof value === 'string' && value.startsWith('$SECRET.')) {
      const name = value.slice(8)
      const result = this.flow.secrets[name]
      if (!result) return
      return parse(result)
    }

    // --- If the value is a result of another node, resolve it's value.
    if (typeof value === 'string' && value.startsWith('$NODE.')) {
      const [id, portId] = value.slice(6).split(':')
      const result = this.flow.getNodeInstance(id).getResultValue(portId as InferResultKeys<T>)
      if (!result) return
      return parse(result)
    }

    // --- Otherwise, return the value as is.
    return parse(value)
  }

  /**
   * A proxy object that is used to access the data of the node. The proxy
   * object is used to resolve the data value of the node by key.
   *
   * @returns A proxy object that is used to access the data of the node.
   */
  public get data() {
    // eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
    const that = this
    return new Proxy(this.dataRaw as InferData<T>, {
      get(_, key: string) { return that.resolveDataValue(key) },
    })
  }

  /**
   * Return the context object that is used to process the node. The context
   * object contains the data, the secrets, variables and the abort signal.
   * The context object is passed to the `process` function of the node.
   *
   * @returns The context object that is used to process the node.
   */
  public get context(): FlowNodeContext<InferDataSchema<T>, InferResultSchema<T>> {
    return {
      flow: this.flow,
      data: this.data as Pretty<Partial<InferData<T>>>,
      result: this.result as Pretty<Partial<InferResult<T>>>,
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
      this.isRunning = true
      this.dispatch('start')
      await this.resolveDataSchema()
      await this.resolveResultSchema()
      const result = await this.node.process(this.context)
      if (result) this.setResult(result as InferResult<T>)
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
export function createFlowNodeInstance<T extends FlowNode<string, any, any>>(options: FlowNodeInstanceOptions<T>) {
  return new FlowNodeInstance(options)
}
