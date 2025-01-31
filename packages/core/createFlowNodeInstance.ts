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
 * A map of events that can be dispatched by a flow node and the parameters
 * that are passed to the event listeners.
 */
export interface FlowNodeEvents<T extends FlowNode> {
  meta: [meta: Partial<FlowNodeInstanceMeta>]
  metaValue: [key: string, value: unknown]
  data: [data: Partial<InferData<T>>]
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
    this.data = { ...options.initialData } as InferData<T>
    this.result = { ...options.initialResult } as InferResult<T>
    this.dataSchema = typeof this.node.defineDataSchema === 'function' ? undefined : this.node.defineDataSchema as InferDataSchema<T>
    this.resultSchema = typeof this.node.defineResultSchema === 'function' ? undefined : this.node.defineResultSchema as InferResultSchema<T>
  }

  public flow
  public node
  public meta: FlowNodeInstanceMeta = {}
  public id = randomUUID() as string
  public secrets = {} as Record<string, string>
  public parameters = {} as Record<string, unknown>
  public environment = {} as Record<string, string>

  public data = {} as Partial<InferData<T>>
  public result = {} as Partial<InferResult<T>>
  public dataSchema: InferDataSchema<T> | undefined
  public resultSchema: InferResultSchema<T> | undefined

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
   * Given a key, get the `ChainNodePort` that corresponds to the key of
   * the data schema.
   *
   * @param key The key of the data schema to get the port for.
   * @returns The port that corresponds to the key of the data schema.
   */
  public getDataPort<K extends InferDataKeys<T>>(key: K): InferDataSchema<T>[K] {
    if (!this.dataSchema) throw new Error('Data schema not resolved')
    if (!this.dataSchema[key]) throw new Error(`The data schema of node "${this.id}" does not contain a port with the key "${key}"`)
    return this.dataSchema[key]
  }

  /**
   * Set the value of a data property of the node by key.
   *
   * @param key The key of the data property.
   * @param value The value of the data property.
   */
  public async setDataValue<K extends InferDataKeys<T>>(key: K, value: InferDataValue<T, K>): Promise<void> {
    const port = this.getDataPort(key)
    this.data[key] = port.type.parse(value) as InferDataValue<T, K>
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
    if (!this.dataSchema) throw new Error('Data schema not resolved')
    const parse = createSchemaParser(this.dataSchema)
    this.data = parse(data)
    this.dispatch('data', this.data)
    await this.resolveDataSchema(true)
    await this.resolveResultSchema(true)
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
    if (!this.resultSchema[key]) throw new Error(`The result schema of node "${this.id}" does not contain a port with the key "${key}"`)
    return this.resultSchema[key]
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
   * Return the context object that is used to process the node. The context
   * object contains the data, the secrets, the parameters, and the abort signal.
   * The context object is passed to the `process` function of the node.
   *
   * @returns The context object that is used to process the node.
   */
  public get context(): FlowNodeContext<InferDataSchema<T>, InferResultSchema<T>> {
    return {
      flow: this.flow,
      data: this.data as Pretty<Partial<InferData<T>>>,
      result: this.result as Pretty<Partial<InferResult<T>>>,
      dataSchema: this.dataSchema!,
      resultSchema: this.resultSchema!,
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
    this.abortController = new AbortController()
  }

  /**
   * Process the node by calling the `process` function of the node with the
   * context of the node. The context contains the data, the secrets, the
   * parameters, and the abort signal.
   *
   * @example
   *
   * // Create a new flow with a single node.
   * using flow = createFlow({ modules: [Core] })
   * const node = flow.node('core:json-parse', { initialData: { json: '{"key": "value"}' } })
   *
   * // Start processing the node right away.
   * node.process()
   */
  public async process(): Promise<void> {
    try {

      // --- Process the node. If no result is returned, cancel the operation
      // --- and await the next data event to process the node again.
      const result = await this.node.process!(this.context)
      if (result === undefined) return

      // --- Parse the result based on the result schema and store the result.
      const resultSchema = await this.resolveResultSchema()
      const resultParse = createSchemaParser(resultSchema)
      const resultParsed = resultParse(result)
      this.setResult(resultParsed)

      // --- Stop the node and resolve the promise.
      this.isRunning = false
      this.dispatch('end')
    }

    // --- If an error occurs, dispatch the error event and trigger
    // --- the abort signal so pending operations are cancelled.
    catch (error) {
      this.dispatch('error', error as Error)
    }
  }

  /**
   * Execute the node by calling the `process` function of the node with the
   * context of the node. The context contains the data, the secrets, the
   * parameters, and the abort signal.
   *
   * @example
   *
   * // Create a new flow with a single node.
   * using flow = createFlow({ modules: [Core] })
   * const node = flow.node('core:json-parse', { initialData: { json: '{"key": "value"}' } })
   *
   * // Start listening for the "data" event and execute the node.
   * node.start()
   *
   * // After some time, the "result" event is dispatched with the result.
   * node.on('result', result => console.log(result)) // { key: 'value' }
   */
  public start() {
    if (!this.node.process) return
    if (this.isRunning) return
    this.dispatch('start')
    this.isRunning = true

    // --- On data, process the node and store the result.
    const stop = this.on('data', () => this.process())
    this.on('end', stop)

    // --- On abort, stop the node and resolve the promise.
    this.context.abortSignal.addEventListener('abort', () => {
      this.isRunning = false
      this.dispatch('abort')
      stop()
    })
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
export function createFlowNodeInstance<T extends FlowNode<string, any, any>>(options: FlowNodeInstanceOptions<T>) {
  return new FlowNodeInstance(options)
}

/* v8 ignore start */
/* eslint-disable sonarjs/no-duplicate-string */
if (import.meta.vitest) {
  const { createFlow } = await import('./createFlow')
  const { defineFlowNode } = await import('./defineFlowNode')
  const { defineFlowType } = await import('./defineFlowType')
  const { typeString, typeBoolean } = await import('./__fixtures__')

  describe('createFlowNodeInstance', () => {
    it('should store the flow and the node definition', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.flow).toBe(flow)
      expect(instance.node).toBe(node)
    })

    it('should store the id, secrets, parameters, and environment', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node, id: 'node' })
      expect(instance.id).toBe('node')
      expect(instance.secrets).toStrictEqual({})
      expect(instance.parameters).toStrictEqual({})
      expect(instance.environment).toStrictEqual({})
    })

    it('should automatically generate an UUID for the id if not provided', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.id).toMatch(/[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}/)
    })

    it('should pass the initial data if provided', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node, initialData: { string: 'Hello, World!' } })
      expect(instance.data).toStrictEqual({ string: 'Hello, World!' })
    })

    it('should not pass the initial data reference', () => {
      using flow = createFlow()
      const initialData = { string: 'Hello, World!' }
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node, initialData })
      expect(instance.data).not.toBe(initialData)
    })

    it('should pass the initial result if provided', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node, initialResult: { boolean: false } })
      expect(instance.result).toStrictEqual({ boolean: false })
    })

    it('should not pass the initial result reference', () => {
      using flow = createFlow()
      const initialResult = { boolean: false }
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node, initialResult })
      expect(instance.result).not.toBe(initialResult)
    })
  })

  describe('eventTarget', () => {
    it('should dispatch an event and call the listener', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.dispatch('data', { string: 'Hello, World!' })
      expect(listener).toHaveBeenCalledWith({ string: 'Hello, World!' })
    })

    it('should remove the listener when disposed', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance[Symbol.dispose]()
      instance.dispatch('data', { string: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })

    it('should remove the listener when calling the return value of on', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      const removeListener = instance.on('data', listener)
      removeListener()
      instance.dispatch('data', { string: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('resolveDataSchema', () => {
    it('should resolve the data schema imedialety if the initial data schema is an object', () => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { string: port } })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.dataSchema).toStrictEqual({ string: port })
    })

    it('should not have a data schema if the initial data schema is a function', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: () => ({}) })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.dataSchema).toBeUndefined()
    })

    it('should resolve the data schema when calling resolveDataSchema', async() => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: () => ({ string: port }) })
      using instance = createFlowNodeInstance({ flow, node })
      const result = await instance.resolveDataSchema()
      expect(result).toStrictEqual({ string: port })
      expect(instance.dataSchema).toStrictEqual({ string: port })
    })

    it('should emit the "dataSchema" event when the data schema is resolved', async() => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: () => ({ string: port }) })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('dataSchema', listener)
      await instance.resolveDataSchema()
      expect(listener).toHaveBeenCalledWith({ string: port })
    })

    it('should not emit the "dataSchema" event when the data schema is already resolved', async() => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: () => ({ string: port }) })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('dataSchema', listener)
      await instance.resolveDataSchema()
      await instance.resolveDataSchema()
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('should refresh the data schema when calling resolveDataSchema with refresh = true', async() => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: () => ({ string: port }) })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('dataSchema', listener)
      await instance.resolveDataSchema()
      await instance.resolveDataSchema(true)
      expect(listener).toHaveBeenCalledTimes(2)
    })
  })

  describe('resolveResultSchema', () => {
    it('should resolve the result schema imedialety if the initial result schema is an object', () => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { string: port } })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.resultSchema).toStrictEqual({ string: port })
    })

    it('should not have a result schema if the initial result schema is a function', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: () => ({}) })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.resultSchema).toBeUndefined()
    })

    it('should resolve the result schema when calling resolveResultSchema', async() => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: () => ({ string: port }) })
      using instance = createFlowNodeInstance({ flow, node })
      const result = await instance.resolveResultSchema()
      expect(result).toStrictEqual({ string: port })
      expect(instance.resultSchema).toStrictEqual({ string: port })
    })

    it('should emit the "resultSchema" event when the result schema is resolved', async() => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: () => ({ string: port }) })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('resultSchema', listener)
      await instance.resolveResultSchema()
      expect(listener).toHaveBeenCalledWith({ string: port })
    })

    it('should not emit the "resultSchema" event when the result schema is already resolved', async() => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: () => ({ string: port }) })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('resultSchema', listener)
      await instance.resolveResultSchema()
      await instance.resolveResultSchema()
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('should refresh the result schema when calling resolveResultSchema with refresh = true', async() => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: () => ({ string: port }) })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('resultSchema', listener)
      await instance.resolveResultSchema()
      await instance.resolveResultSchema(true)
      expect(listener).toHaveBeenCalledTimes(2)
    })
  })

  describe('getDataPort', () => {
    it('should get the port by key from the data schema', () => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { string: port } })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.getDataPort('string')).toStrictEqual(port)
    })

    it('should throw an error if the data schema is not resolved', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: () => ({ string: { name: 'Value', type: typeString } }) })
      using instance = createFlowNodeInstance({ flow, node })
      const shouldThrow = () => instance.getDataPort('string')
      expect(shouldThrow).toThrow('Data schema not resolved')
    })

    it('should throw an error if the key does not exist in the data schema', () => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { string: port } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The key "number" does not exist in the data schema.
      const shouldThrow = () => instance.getDataPort('number')
      expect(shouldThrow).toThrow(/The data schema of node "[\da-z\-]+" does not contain a port with the key "number"/)
    })
  })

  describe('getResultPort', () => {
    it('should get the port by key from the result schema', () => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { string: port } })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.getResultPort('string')).toStrictEqual(port)
    })

    it('should throw an error if the result schema is not resolved', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: () => ({ string: { name: 'Value', type: typeString } }) })
      using instance = createFlowNodeInstance({ flow, node })
      const shouldThrow = () => instance.getResultPort('string')
      expect(shouldThrow).toThrow('Result schema not resolved')
    })

    it('should throw an error if the key does not exist in the result schema', () => {
      using flow = createFlow()
      const port = { name: 'Value', type: typeString }
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { string: port } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The key "number" does not exist in the result schema.
      const shouldThrow = () => instance.getResultPort('number')
      expect(shouldThrow).toThrow(/The result schema of node "[\da-z\-]+" does not contain a port with the key "number"/)
    })
  })

  describe('setDataValue', () => {
    it('should set the value of a data property by key', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      await instance.setDataValue('string', 'Hello, World!')
      expect(instance.data).toStrictEqual({ string: 'Hello, World!' })
    })

    it('should throw an error if the data schema is not resolved', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: () => ({ string: { name: 'Value', type: typeString } }) })
      using instance = createFlowNodeInstance({ flow, node })
      const shouldReject = async() => await instance.setDataValue('string', 'Hello, World!')
      await expect(shouldReject).rejects.toThrow('Data schema not resolved')
    })

    it('should throw an error if the key does not exist in the data schema', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The key "number" does not exist in the data schema.
      const shouldReject = async() => await instance.setDataValue('number', 42)
      await expect(shouldReject).rejects.toThrow(/The data schema of node "[\da-z\-]+" does not contain a port with the key "number"/)
    })

    it('should parse the input value based on the type parser of the port', async() => {
      using flow = createFlow()
      const type = defineFlowType({ kind: 'core:number', parse: Number })
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { number: { name: 'Value', type } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The value "42" can be parsed as a number.
      await instance.setDataValue('number', '42')
      expect(instance.data).toStrictEqual({ number: 42 })
    })

    it('should emit the "data" event when the data is set', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('data', listener)
      await instance.setDataValue('string', 'Hello, World!')
      expect(listener).toHaveBeenCalledWith({ string: 'Hello, World!' })
    })

    it('should resolve the data schema when the data is set', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('dataSchema', listener)
      await instance.setDataValue('string', 'Hello, World!')
      expect(listener).toHaveBeenCalledWith({ string: { name: 'Value', type: typeString } })
    })

    it('should resolve the result schema when the data is set', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('resultSchema', listener)
      await instance.setDataValue('string', 'Hello, World!')
      expect(listener).toHaveBeenCalledWith({})
    })
  })

  describe('setData', () => {
    it('should set the data of the node', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      await instance.setData({ string: 'Hello, World!' })
      expect(instance.data).toStrictEqual({ string: 'Hello, World!' })
    })

    it('should parse the input data based on the type parser of the port', async() => {
      using flow = createFlow()
      const type = defineFlowType({ kind: 'core:number', parse: Number })
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { number: { name: 'Value', type } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The value "42" can be parsed as a number.
      await instance.setData({ number: '42' })
      expect(instance.data).toStrictEqual({ number: 42 })
    })

    it('should emit the "data" event when the data is set', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('data', listener)
      await instance.setData({ string: 'Hello, World!' })
      expect(listener).toHaveBeenCalledWith({ string: 'Hello, World!' })
    })

    it('should resolve the data schema when the data is set', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('dataSchema', listener)
      await instance.setData({ string: 'Hello, World!' })
      expect(listener).toHaveBeenCalledWith({ string: { name: 'Value', type: typeString } })
    })

    it('should resolve the result schema when the data is set', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { string: { name: 'Value', type: typeString } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('resultSchema', listener)
      await instance.setData({ string: 'Hello, World!' })
      expect(listener).toHaveBeenCalledWith({})
    })

    it('should throw an error if the data schema is not resolved', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: () => ({ string: { name: 'Value', type: typeString } }) })
      using instance = createFlowNodeInstance({ flow, node })
      const shouldReject = async() => await instance.setData({ string: 'Hello, World!' })
      await expect(shouldReject).rejects.toThrow('Data schema not resolved')
    })

    it('should throw an error if the parser throws an error', async() => {
      using flow = createFlow()
      const type = defineFlowType({ kind: 'core:number', parse: () => { throw new Error('Failed to parse') } })
      const node = defineFlowNode({ kind: 'core:example', defineDataSchema: { number: { name: 'Value', type } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: Ignore the type error.
      const shouldReject = async() => await instance.setData({ number: '42' })
      await expect(shouldReject).rejects.toThrow('Failed to parse')
    })
  })

  describe('setResultValue', () => {
    it('should set the value of a result property by key', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      instance.setResultValue('boolean', true)
      expect(instance.result).toStrictEqual({ boolean: true })
    })

    it('should throw an error if the result schema is not resolved', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: () => ({ boolean: { name: 'Value', type: typeBoolean } }) })
      using instance = createFlowNodeInstance({ flow, node })
      const shouldThrow = () => instance.setResultValue('boolean', true)
      expect(shouldThrow).toThrow('Result schema not resolved')
    })

    it('should throw an error if the key does not exist in the result schema', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The key "number" does not exist in the result schema.
      const shouldThrow = () => instance.setResultValue('number', 42)
      expect(shouldThrow).toThrow(/The result schema of node "[\da-z\-]+" does not contain a port with the key "number"/)
    })

    it('should parse the input value based on the type parser of the port', () => {
      using flow = createFlow()
      const type = defineFlowType({ kind: 'core:number', parse: Number })
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { number: { name: 'Value', type } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The value "42" can be parsed as a number.
      instance.setResultValue('number', '42')
      expect(instance.result).toStrictEqual({ number: 42 })
    })

    it('should emit the "result" event when the result is set', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('result', listener)
      instance.setResultValue('boolean', true)
      expect(listener).toHaveBeenCalledWith({ boolean: true })
    })

    it('should not emit the "data" event when the result is set', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.setResultValue('boolean', true)
      expect(listener).not.toHaveBeenCalled()
    })

    it('should not refresh the schemas when the result is set', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listenerResultSchema = vi.fn()
      const listenerDataSchema = vi.fn()
      instance.on('resultSchema', listenerResultSchema)
      instance.on('dataSchema', listenerDataSchema)
      instance.setResultValue('boolean', true)
      expect(listenerResultSchema).not.toHaveBeenCalled()
      expect(listenerDataSchema).not.toHaveBeenCalled()
    })
  })

  describe('setResult', () => {
    it('should set the result of the node', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      instance.setResult({ boolean: true })
      expect(instance.result).toStrictEqual({ boolean: true })
    })

    it('should parse the input result based on the type parser of the port', () => {
      using flow = createFlow()
      const type = defineFlowType({ kind: 'core:number', parse: Number })
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { number: { name: 'Value', type } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: The value "42" can be parsed as a number.
      instance.setResult({ number: '42' })
      expect(instance.result).toStrictEqual({ number: 42 })
    })

    it('should emit the "result" event when the result is set', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('result', listener)
      instance.setResult({ boolean: true })
      expect(listener).toHaveBeenCalledWith({ boolean: true })
    })

    it('should not emit the "data" event when the result is set', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { boolean: { name: 'Value', type: typeBoolean } } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance.setResult({ boolean: true })
      expect(listener).not.toHaveBeenCalled()
    })

    it('should throw an error if the result schema is not resolved', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: () => ({ boolean: { name: 'Value', type: typeBoolean } }) })
      using instance = createFlowNodeInstance({ flow, node })
      const shouldThrow = () => instance.setResult({ boolean: true })
      expect(shouldThrow).toThrow('Result schema not resolved')
    })

    it('should throw an error if the parser throws an error', () => {
      using flow = createFlow()
      const type = defineFlowType({ kind: 'core:number', parse: () => { throw new Error('Failed to parse') } })
      const node = defineFlowNode({ kind: 'core:example', defineResultSchema: { number: { name: 'Value', type } } })
      using instance = createFlowNodeInstance({ flow, node })
      // @ts-expect-error: Ignore the type error.
      const shouldThrow = () => instance.setResult({ number: '42' })
      expect(shouldThrow).toThrow('Failed to parse')
    })
  })

  describe('start', () => {
    it('should return undefined', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', process: () => {} })
      using instance = createFlowNodeInstance({ flow, node })
      const result = instance.start()
      expect(result).toBeUndefined()
    })

    it('should not do anything if the process function does not exist', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('start', listener)
      instance.start()
      expect(listener).not.toHaveBeenCalled()
    })

    it('should not do anything if the node is already running', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', process: () => {} })
      using instance = createFlowNodeInstance({ flow, node })
      void instance.start()
      const listener = vi.fn()
      instance.on('start', listener)
      instance.start()
      await new Promise(resolve => setTimeout(resolve, 5))
      expect(listener).not.toHaveBeenCalled()
    })

    it('should emit the "start" event when the node starts processing', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', process: () => {} })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('start', listener)
      void instance.start()
      await new Promise(resolve => setTimeout(resolve, 5))
      expect(listener).toHaveBeenCalledWith()
    })

    it('should set the "isRunning" property to true when the node starts processing', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', process: () => {} })
      using instance = createFlowNodeInstance({ flow, node })
      expect(instance.isRunning).toBe(false)
      void instance.start()
      await new Promise(resolve => setTimeout(resolve, 5))
      expect(instance.isRunning).toBe(true)
    })

    it('should call the process function when the "data" event is received', async() => {
      using flow = createFlow()
      const process = vi.fn()
      const node = defineFlowNode({ kind: 'core:example', process })
      using instance = createFlowNodeInstance({ flow, node })
      void instance.start()
      await instance.setData({ string: 'Hello, World!' })
      expect(process).toHaveBeenCalledWith(instance.context)
    })

    it('should call the process function with the context of the node', async() => {
      using flow = createFlow()
      const process = vi.fn()
      const node = defineFlowNode({ kind: 'core:example', process })
      using instance = createFlowNodeInstance({ flow, node })
      void instance.start()
      await instance.setData({ string: 'Hello, World!' })
      expect(process).toHaveBeenCalledWith(instance.context)
    })

    it('should emit the "end" event when the process function is finished', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', process: () => ({}) })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('end', listener)
      void instance.start()
      await instance.setData({ string: 'Hello, World!' })
      await new Promise(resolve => setTimeout(resolve, 5))
      expect(listener).toHaveBeenCalledWith()
    })

    it('should set the "isRunning" property to false when the process function is finished', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', process: () => ({}) })
      using instance = createFlowNodeInstance({ flow, node })
      void instance.start()
      await instance.setData({ string: 'Hello, World!' })
      await new Promise(resolve => setTimeout(resolve, 5))
      expect(instance.isRunning).toBe(false)
    })

    it('should set the result of the node when the process function is finished', async() => {
      using flow = createFlow()
      const node = defineFlowNode({
        kind: 'core:example',
        defineDataSchema: () => ({ string: { name: 'Value', type: typeString } }),
        defineResultSchema: () => ({ result: { name: 'Result', type: typeString } }),
        process: ({ data }) => ({ result: `Hello, ${data.string}!` }),
      })
      using instance = createFlowNodeInstance({ flow, node })
      void instance.start()
      await instance.resolveDataSchema()
      await instance.setData({ string: 'John' })
      await new Promise(resolve => setTimeout(resolve, 5))
      expect(instance.result).toStrictEqual({ result: 'Hello, John!' })
    })

    it('should emit the "result" event when the result is set', async() => {
      using flow = createFlow()
      const node = defineFlowNode({
        kind: 'core:example',
        defineDataSchema: () => ({ string: { name: 'Value', type: typeString } }),
        defineResultSchema: () => ({ result: { name: 'Result', type: typeString } }),
        process: ({ data }) => ({ result: `Hello, ${data.string}!` }),
      })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('result', listener)
      void instance.start()
      await instance.resolveDataSchema()
      await instance.setData({ string: 'John' })
      await new Promise(resolve => setTimeout(resolve, 5))
      expect(listener).toHaveBeenCalledWith({ result: 'Hello, John!' })
    })

    it('should emit an "error" event when the process function throws an error', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', process: () => { throw new Error('Failed to process') } })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('error', listener)
      void instance.start()
      await instance.setData({ string: 'Hello, World!' })
      await new Promise(resolve => setTimeout(resolve, 5))
      expect(listener).toHaveBeenCalledWith(new Error('Failed to process'))
    })
  })

  describe('abort', () => {
    it('should trigger the "AbortSignal" when the node is aborted', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const callback = vi.fn()
      instance.context.abortSignal.addEventListener('abort', callback)
      instance.abort()
      expect(callback).toHaveBeenCalledOnce()
    })

    it('should create and assign a new "AbortSignal" when the node is aborted', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const signal = instance.context.abortSignal
      instance.abort()
      expect(instance.context.abortSignal).not.toBe(signal)
    })

    it('should emit the "abort" event when the node is aborted', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', process: () => {} })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('abort', listener)
      void instance.start()
      instance.abort()
      await new Promise(resolve => setTimeout(resolve, 5))
      expect(listener).toHaveBeenCalledWith()
    })

    it('should set the "isRunning" property to false when the node is aborted', async() => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example', process: () => {} })
      using instance = createFlowNodeInstance({ flow, node })
      void instance.start()
      instance.abort()
      await new Promise(resolve => setTimeout(resolve, 5))
      expect(instance.isRunning).toBe(false)
    })

    it('should not call the process function when the node is aborted and the "data" event is received', async() => {
      using flow = createFlow()
      const process = vi.fn()
      const node = defineFlowNode({ kind: 'core:example', process })
      using instance = createFlowNodeInstance({ flow, node })
      void instance.start()
      instance.abort()
      await instance.setData({ string: 'Hello, World!' })
      expect(process).not.toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('should abort the node when disposed', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const abort = vi.fn()
      instance.abort = abort
      instance[Symbol.dispose]()
      expect(abort).toHaveBeenCalledOnce()
    })

    it('should remove all event listeners when disposed', () => {
      using flow = createFlow()
      const node = defineFlowNode({ kind: 'core:example' })
      using instance = createFlowNodeInstance({ flow, node })
      const listener = vi.fn()
      instance.on('data', listener)
      instance[Symbol.dispose]()
      instance.dispatch('data', { string: 'Hello, World!' })
      expect(listener).not.toHaveBeenCalled()
    })
  })
}
