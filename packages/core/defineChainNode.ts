import { MaybePromise, SchemaLike, createParser } from 'unshared'
import { InferSchemaKeys, InferSchemaType, InferSchemaValue, Schema } from './types'
import { ChainType } from './defineChainType'
import { Chain } from './defineChain'

/**
 * A schema that contains the ports of a chain. It allows the definition of
 * the label as well as the type of the port that is used in the chain.
 */
export interface ChainNodePort<T = any> {
  name: string
  type: ChainType<T>
  description?: string
  disallowStatic?: boolean
  disallowDynamic?: boolean
}

/**
 * A map of events that can be dispatched by a chain node and the parameters
 * that are passed to the event listeners.
 */
interface ChainNodeEvents<T extends Schema = any, U extends Schema = any> {
  data: [Partial<InferSchemaType<T>>]
  result: [Partial<InferSchemaType<U>>]
  dataSchema: [T]
  resultSchema: [U]
  end: []
  start: []
  error: [Error]
  reset: []
}

/**
 * A listener for a chain node event. The listener is called when the event is
 * dispatched by the chain node.
 */
type ChainNodeListener<T extends Schema, U extends Schema, K extends keyof ChainNodeEvents<T, U>> =
  (...parameters: ChainNodeEvents<T, U>[K]) => void

/**
 * The parameters passed to the process function of a chain node. The parameters
 * contain the input values and additional parameters that can be used to
 * process the data.
 */
export interface ChainNodeContext<T extends Schema, U extends Schema> {
  dataSchema: T
  resultSchema: U
  data: InferSchemaType<T>
  secrets: Record<string, unknown>
  parameters: Record<string, unknown>
  abortSignal: AbortSignal
}

/**
 * The options that are used to define a chain node. The options contain the
 * name, label, icon, description, initial data, data schema, result schema,
 * and the process function of the chain node.
 *
 * @template T The schema of the data that the node expects.
 * @template U The schema of the result that the node produces.
 */
export interface ChainNodeOptions<T extends Schema, U extends Schema> {
  name: string
  label: string
  icon?: string
  description?: string
  initialData?: Partial<InferSchemaType<T>>

  /**
   * A function that defines the schema of the data that the node expects.
   * The schema is used to validate the data that is passed to the node and
   * to provide information about the data that is expected.
   *
   * @returns The schema of the data that the node expects.
   */
  defineDataSchema: () => MaybePromise<T>

  /**
   * A function that defines the schema of the result that the node produces.
   * The schema is used to validate the result that is produced by the node
   * and to provide information about the result that is produced.
   *
   * @returns The schema of the result that the node produces.
   */
  defineResultSchema: (data: Partial<InferSchemaType<T>>) => MaybePromise<U>

  /**
   * A function that processes the data of the node and produces a result.
   * The function is called with the context of the node that contains the
   * data, the secrets, the parameters, and the abort signal.
   *
   * @param context The context of the node.
   * @returns The result of the node.
   * @example
   * ({ data, secrets }) => ({
   *   model: {
   *     apiKey: secrets.apiKey,
   *     name: data.modelName,
   *     endpoint: 'https://api.openai.com/v1/completions',
   *   },
   * })
   */
  process: (context: ChainNodeContext<T, U>) => MaybePromise<InferSchemaType<U> | undefined>
}

export interface ChainNodeObject {
  id: string
  name: string
  icon?: string
  label: string
  position: { x: number; y: number }
  data: Record<string, unknown>
  dataSchema: Schema
  result: Record<string, unknown>
  resultSchema: Schema
}

/**
 * A function that instantiates a chain node with the given ID and initial data.
 * The function is used to create a new chain node with the given ID and initial
 * data that can be used in a chain to process data.
 */
export type ChainNodeConstructor<T extends Schema = any, U extends Schema = any> =
  (id: string, initialData?: Partial<InferSchemaType<T>>) => ChainNode<T, U>

/**
 * A chain node that can be used in a chain to process data.
 * It is the basic building block of a chain that can be connected to other
 * nodes to create a chain of nodes that process data in a sequence.
 *
 * @example new ChainNode({ id: 'core:entrypoint', name: 'Entrypoint' })
 */
export class ChainNode<T extends Schema = any, U extends Schema = any> {
  constructor(options: ChainNodeOptions<T, U>) {
    this.name = options.name
    this.label = options.label
    this.icon = options.icon
    this.description = options.description
    this.defineDataSchema = options.defineDataSchema
    this.defineResultSchema = options.defineResultSchema
    this.process = options.process
    this.data = { ...options.initialData } as InferSchemaType<T>
  }

  static define<T extends Schema, U extends Schema>(options: ChainNodeOptions<T, U>): ChainNodeConstructor<T, U> {
    return (id: string, initialData?: Partial<InferSchemaType<T>>) => {
      const node = new ChainNode({ ...options, initialData })
      node.id = id
      return node
    }
  }

  public id = Math.random().toString(36).slice(2)
  public name
  public label
  public icon
  public description
  public position = { x: 0, y: 0 }
  public chain: Chain | undefined

  private defineDataSchema: () => MaybePromise<T>
  private defineResultSchema: (data: Partial<InferSchemaType<T>>) => MaybePromise<U>
  private process: (context: ChainNodeContext<T, U>) => MaybePromise<InferSchemaType<U> | undefined>
  private data = {} as Partial<InferSchemaType<T>>
  private result = {} as Partial<InferSchemaType<U>>
  private eventTarget = new EventTarget()
  private dataSchema: T | undefined
  private resultSchema: U | undefined

  /**
   * Create a parser out of a `Schema` type. The parser is used to parse the
   * value of the schema and to validate the value of the schema.
   *
   * @param schema The schema to create a parser from.
   * @returns The parser created from the schema.
   */
  private createParser<T extends Schema>(schema: T): (value: unknown) => InferSchemaType<T> {
    const parser = {} as SchemaLike
    for (const key in schema) parser[key] = schema[key].type.parse
    return createParser(parser) as unknown as (value: unknown) => InferSchemaType<T>
  }

  /**
   * Dispatch an event to the node. The event is dispatched to all nodes in
   * the chain.
   *
   * @param event The event to dispatch.
   * @param parameters The parameters to pass to the event listeners.
   */
  dispatch<K extends keyof ChainNodeEvents>(event: K, ...parameters: ChainNodeEvents<T, U>[K]) {
    this.eventTarget.dispatchEvent(new CustomEvent(event, { detail: parameters }))
  }

  /**
   * Add a listener for a chain node event. The listener is called when the event
   * is dispatched by the chain node.
   *
   * @param event The event to listen for.
   * @param listener The listener to call when the event is dispatched.
   */
  on<K extends keyof ChainNodeEvents>(event: K, listener: ChainNodeListener<T, U, K>) {
    this.eventTarget.addEventListener(event, (event) => {
      listener(...(event as CustomEvent<ChainNodeEvents<T, U>[K]>).detail)
    })
  }

  /**
   * Resolve the schema of the data that the node expects. If the schema is
   * already resolved, the resolved schema is returned. Otherwise, the given
   * `defineDataSchema` function is called to resolve the schema and the schema
   * is stored in the state.
   *
   * @returns The schema of the data that the node expects.
   */
  async resolveDataSchema() {
    if (this.dataSchema) return this.dataSchema
    const schema = await this.defineDataSchema()
    this.dispatch('dataSchema', schema as T)
    return this.dataSchema = schema as T
  }

  /**
   * Resolve the schema of the result that the node produces. If the schema is
   * already resolved, the resolved schema is returned. Otherwise, the given
   * `defineResultSchema` function is called to resolve the schema and the schema
   * is stored in the state.
   *
   * @returns The schema of the result that the node produces.
   */
  async resolveResultSchema() {
    if (this.resultSchema) return this.resultSchema
    const schema = await this.defineResultSchema(this.data)
    this.dispatch('resultSchema', schema as U)
    return this.resultSchema = schema as U
  }

  /**
   * Set the value of a data property of the node by key.
   *
   * @param key The key of the data property.
   * @param value The value of the data property.
   */
  setDataValue<K extends InferSchemaKeys<T>>(key: K, value: InferSchemaValue<T, K>): void {
    this.data = this.data ?? {}
    this.data[key] = value
    this.dispatch('data', this.data)
  }

  /**
   * Set the data of the node.
   *
   * @param data The data to set.
   */
  setData(data: InferSchemaType<T>): void {
    this.data = data
    this.dispatch('data', this.data)
  }

  /**
   * Set a property of the result of the node by key.
   *
   * @param key The key of the result property.
   * @param value The value of the result property.
   */
  setResultValue<K extends InferSchemaKeys<U>>(key: K, value: InferSchemaValue<U, K>): void {
    this.result[key] = value
    this.dispatch('result', this.result)
  }

  /**
   * Set the result of the node.
   *
   * @param result The result to set.
   */
  setResult(result: InferSchemaType<U>): void {
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
  getDataPort<K extends InferSchemaKeys<T>>(key: K): ChainNodePort<InferSchemaValue<T, K>> {
    if (!this.dataSchema) throw new Error('Data schema not resolved')
    const schema = this.dataSchema
    return schema[key] as ChainNodePort<InferSchemaValue<T, K>>
  }

  /**
   * Given a key, get the `ChainNodePort` that corresponds to the key of
   * the result schema.
   *
   * @param key The key of the result schema to get the port for.
   * @returns The port that corresponds to the key of the result schema.
   */
  getResultPort<K extends InferSchemaKeys<U>>(key: K): ChainNodePort<InferSchemaValue<U, K>> {
    if (!this.resultSchema) throw new Error('Result schema not resolved')
    const schema = this.resultSchema
    return schema[key] as ChainNodePort<InferSchemaValue<U, K>>
  }

  /**
   * Execute the node by calling the `process` function of the node with the
   * context of the node. The context contains the data, the secrets, the
   * parameters, and the abort signal.
   */
  async execute() {
    // if (state.paused) return
    if (this.data === undefined) return
    this.dispatch('start')
    const abortController = new AbortController()

    // --- Resolve the data schema and the result schema of the node.
    try {
      const dataSchema = await this.resolveDataSchema()
      const resultSchema = await this.resolveResultSchema()
      const dataParse = this.createParser(dataSchema)
      const resultParse = this.createParser(resultSchema)

      // --- Create the context used to process the node.
      const context = {
        dataSchema,
        resultSchema,
        data: dataParse(this.data),
        secrets: {},
        parameters: {},
        abortSignal: abortController.signal,
      }

      // --- Process the node and store the result.
      const result = await this.process(context)
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
      abortController.abort(error as Error)
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
  toJSON(): ChainNodeObject {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      label: this.label,
      position: this.position,
      data: this.data,
      result: this.result,
      dataSchema: this.dataSchema as Schema,
      resultSchema: this.resultSchema as Schema,
    }
  }
}

/**
 * Define a chain node with the given options.
 *
 * @param options The options to define the chain node.
 * @returns A function that creates a new chain node with the given id and initial data.
 */
export function defineChainNode<T extends Schema, U extends Schema>(options: ChainNodeOptions<T, U>) {
  return ChainNode.define(options)
}
