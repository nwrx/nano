import type { Flow } from './createFlow'
import type { FlowNode, FlowNodeContext, FlowSchema, FlowSchemaJSON } from './defineFlowNode'
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
 * A map of events that can be dispatched by a flow node and the parameters
 * that are passed to the event listeners.
 */
interface FlowNodeEvents<T extends FlowNode> {
  data: [data: Partial<InferData<T>>]
  result: [result: Partial<InferResult<T>>]
  dataSchema: [schema: InferDataSchema<T>]
  resultSchema: [schema: InferResultSchema<T>]
  end: []
  start: []
  error: [error: Error]
  reset: []
}

/**
 * A listener for a flow node event. The listener is called when the event is
 * dispatched by the flow node.
 */
type FlowNodeListener<T extends FlowNode, K extends keyof FlowNodeEvents<T>> =
  (...parameters: FlowNodeEvents<T>[K]) => void

/**
 * The options that are used to define a flow node. The options contain the
 * name, label, icon, description, initial data, data schema, result schema,
 * and the process function of the flow node.
 *
 * @template T The schema of the data that the node expects.
 * @template U The schema of the result that the node produces.
 */
export interface FlowNodeInstanceOptions<T extends FlowNode = FlowNode> {
  id?: string
  flow: Flow
  node: T
  position?: { x: number; y: number }
  initialData?: Partial<InferData<T>>
  initialResult?: Partial<InferResult<T>>
}

/** The serialized representation of a flow node instance. */
export interface FlowNodeInstanceJSON {
  id: string
  kind: string
  icon?: string
  name: string
  description?: string
  position: { x: number; y: number }
  data: Record<string, unknown>
  result: Record<string, unknown>
  dataSchema: FlowSchemaJSON
  resultSchema: FlowSchemaJSON
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
    if (options.position) this.position = options.position
    this.data = { ...options.initialData } as InferData<T>
    this.result = { ...options.initialResult } as InferResult<T>
  }

  public flow
  public node
  public id = randomUUID() as string
  public position = { x: 0, y: 0 }
  public secrets = {} as Record<string, string>
  public parameters = {} as Record<string, unknown>
  public environment = {} as Record<string, string>

  public abortController = new AbortController()
  public data = {} as Partial<InferData<T>>
  public result = {} as Partial<InferResult<T>>
  public dataSchema: InferDataSchema<T> | undefined
  public resultSchema: InferResultSchema<T> | undefined

  public eventTarget = new EventTarget()
  public eventHandlers = new Map<string, EventListener>()

  /**
   * Dispatch an event to the node. The event is dispatched to all nodes in
   * the flow.
   *
   * @param event The event to dispatch.
   * @param parameters The parameters to pass to the event listeners.
   */
  public dispatch<K extends keyof FlowNodeEvents<T>>(event: K, ...parameters: FlowNodeEvents<T>[K]) {
    this.eventTarget.dispatchEvent(new CustomEvent(event, { detail: parameters }))
  }

  /**
   * Add a listener for a flow node event. The listener is called when the event
   * is dispatched by the flow node.
   *
   * @param event The event to listen for.
   * @param listener The listener to call when the event is dispatched.
   */
  public on<K extends keyof FlowNodeEvents<T>>(event: K, listener: FlowNodeListener<T, K>) {
    const handler = (event: Event) => { listener(...(event as CustomEvent<FlowNodeEvents<T>[K]>).detail) }
    this.eventTarget.addEventListener(event, handler)
    this.eventHandlers.set(event, handler)
  }

  /**
   * Resolve the schema of the data that the node expects. If the schema is
   * already resolved, the resolved schema is returned. Otherwise, the given
   * `defineDataSchema` function is called to resolve the schema and the schema
   * is stored in the state.
   *
   * @param refresh Whether to refresh the schema even if it is already resolved.
   * @returns The schema of the data that the node expects.
   */
  public async resolveDataSchema(refresh = false): Promise<InferDataSchema<T>> {
    if (this.dataSchema && !refresh) return this.dataSchema
    const schema = typeof this.node.defineDataSchema === 'function'
      ? await this.node.defineDataSchema(this.context)
      : this.node.defineDataSchema
    this.dispatch('dataSchema', schema as InferDataSchema<T>)
    return this.dataSchema = schema as InferDataSchema<T>
  }

  /**
   * Resolve the schema of the result that the node produces. If the schema is
   * already resolved, the resolved schema is returned. Otherwise, the given
   * `defineResultSchema` function is called to resolve the schema and the schema
   * is stored in the state.
   *
   * @param refresh Whether to refresh the schema even if it is already resolved.
   * @returns The schema of the result that the node produces.
   */
  public async resolveResultSchema(refresh = false): Promise<InferResultSchema<T>> {
    if (this.resultSchema && !refresh) return this.resultSchema
    const schema = typeof this.node.defineResultSchema === 'function'
      ? await this.node.defineResultSchema(this.context)
      : this.node.defineResultSchema
    this.dispatch('resultSchema', schema as InferResultSchema<T>)
    return this.resultSchema = schema as InferResultSchema<T>
  }

  /**
   * Set the value of a data property of the node by key.
   *
   * @param key The key of the data property.
   * @param value The value of the data property.
   */
  public async setDataValue<K extends InferDataKeys<T>>(key: K, value: InferDataValue<T, K>): Promise<void> {
    this.data = this.data ?? {}
    this.data[key] = value
    this.dispatch('data', this.data)
    await this.resolveDataSchema(true)
    await this.resolveResultSchema(true)
  }

  /**
   * Set the data of the node.
   *
   * @param data The data to set.
   */
  public async setData(data: InferData<T>): Promise<void> {
    this.data = data
    this.dispatch('data', this.data)
    await this.resolveDataSchema(true)
    await this.resolveResultSchema(true)
  }

  /**
   * Set a property of the result of the node by key.
   *
   * @param key The key of the result property.
   * @param value The value of the result property.
   */
  public async setResultValue<K extends InferResultKeys<T>>(key: K, value: InferResultValue<T, K>): Promise<void> {
    this.result[key] = value
    this.dispatch('result', this.result)
    await this.resolveResultSchema(true)
  }

  /**
   * Set the result of the node.
   *
   * @param result The result to set.
   */
  public setResult(result: InferResult<T>): void {
    this.result = result
    this.dispatch('result', this.result)
  }

  /**
   * Given a key, get the `ChainNodePort` that corresponds to the key of
   * the data schema.
   *
   * @param key The key of the data schema to get the port for.
   * @returns The port that corresponds to the key of the data schema.
   */
  public getDataPort<K extends InferDataKeys<T>>(key: K): InferDataSchema<T>[K] {
    if (!this.dataSchema) throw new Error('Data schema not resolved')
    return this.dataSchema[key]
  }

  /**
   * Given a key, get the `ChainNodePort` that corresponds to the key of
   * the result schema.
   *
   * @param key The key of the result schema to get the port for.
   * @returns The port that corresponds to the key of the result schema.
   */
  public getResultPort<K extends InferResultKeys<T>>(key: K): InferResultSchema<T>[K] {
    if (!this.resultSchema) throw new Error('Result schema not resolved')
    return this.resultSchema[key]
  }

  /**
   * Return the context object that is used to process the node. The context
   * object contains the data, the secrets, the parameters, and the abort signal.
   * The context object is passed to the `process` function of the node.
   *
   * @returns The context object that is used to process the node.
   */
  public get context(): FlowNodeContext<InferDataSchema<T>, InferResultSchema<T>> {
    return {
      flow: this.flow,
      data: this.data,
      result: this.result,
      dataSchema: this.dataSchema as Readonly<InferDataSchema<T>>,
      resultSchema: this.resultSchema as Readonly<InferResultSchema<T>>,
      secrets: this.secrets,
      parameters: this.parameters,
      environment: this.environment,
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
    this.dispatch('error', error)
    this.abortController = new AbortController()
  }

  /**
   * Execute the node by calling the `process` function of the node with the
   * context of the node. The context contains the data, the secrets, the
   * parameters, and the abort signal.
   */
  public async process() {
    // if (state.paused) return
    if (this.data === undefined) return
    this.dispatch('start')

    // --- Resolve the data schema and the result schema of the node.
    try {
      const resultSchema = await this.resolveResultSchema()
      const resultParse = createSchemaParser(resultSchema)

      // --- Process the node and store the result.
      const result = await this.node.process(this.context)
      if (result !== undefined) {
        const parsedResult = resultParse(result)
        this.setResult(parsedResult)
        this.dispatch('result', parsedResult)
      }
    }

    // --- If an error occurs, dispatch the error event and trigger
    // --- the abort signal so pending operations are cancelled.
    catch (error) {
      this.dispatch('error', error as Error)
      this.abortController.abort(error as Error)
    }
    finally {
      this.dispatch('end')
    }
  }

  /**
   * Export the node to a JSON object.
   *
   * @returns The JSON object representation of the node.
   */
  public toJSON(): FlowNodeInstanceJSON {
    return {
      id: this.id,
      kind: this.node.kind,
      icon: this.node.icon,
      name: this.node.name,
      description: this.node.description,
      position: this.position,
      data: this.data,
      result: this.result,
      dataSchema: this.dataSchema as FlowSchema,
      resultSchema: this.resultSchema as FlowSchema,
    }
  }

  /**
   * Dispose of the node by removing all event listeners and stopping any
   * pending operations by triggering the abort signal.
   */
  [Symbol.dispose]() {
    this.abort()
    for (const [event, handler] of this.eventHandlers)
      this.eventTarget.removeEventListener(event, handler)
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
export function createFlowNodeInstance<T extends FlowNode>(options: FlowNodeInstanceOptions<T>) {
  return new FlowNodeInstance(options)
}
