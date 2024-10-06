import type { Pretty } from '@unshared/types'
import type { Flow } from './createFlow'
import type { FlowCategory } from './defineFlowCategory'
import type { FlowType } from './defineFlowType'
import type { InferSchemaType } from './types'
import { assertNotNil, assertStringNotEmpty } from '@unshared/validation'

export type FlowNodePortDisplay =
  | 'password'
  | 'select'
  | 'slider'
  | 'stream'
  | 'switch'
  | 'text'
  | 'textarea'
  | 'toggle'

export interface FlowNodePortValue<T = unknown> {
  value: T
  label: string
  icon?: string
  description?: string
}

/**
 * A schema that contains the ports of a flow. It allows the definition of
 * the label as well as the type of the port that is used in the flow.
 */
export interface FlowNodePort<T = unknown> {
  type: FlowType<T>
  name?: string
  display?: FlowNodePortDisplay
  description?: string
  defaultValue?: NoInfer<T>
  disallowStatic?: boolean
  disallowDynamic?: boolean
  values?: Array<FlowNodePortValue<NoInfer<T>>> | Array<NoInfer<T> & string>
  numberMax?: number
  numberMin?: number
  numberStep?: number
}

/**
 * A schema that contains a mapping of the ports of a flow. It allows the
 * definition of the ports and their types that are used in the flow.
 */
export type FlowSchema = Record<string, FlowNodePort>

/**
 * The parameters passed to the process function of a flow node. The parameters
 * contain the input values and additional parameters that can be used to
 * process the data.
 */
export interface FlowNodeContext<
  Data extends FlowSchema = FlowSchema,
  Result extends FlowSchema = FlowSchema,
> {

  /**
   * The flow which the node is a part of. The flow contains all the nodes and
   * the connections between the nodes that are used to process the data.
   */
  flow: Flow

  /**
   * The data that is passed to the node when it is executed. The data comes
   * from the previous nodes or can be statically defined in the flow.
   */
  data: Pretty<Partial<InferSchemaType<Data>>>

  /**
   * The current result that is produced by the node when it is executed. The
   * result is used to pass the output of the node to the next nodes in the flow.
   * The result can be modified by the node to produce the desired output.
   */
  result: Pretty<Partial<InferSchemaType<Result>>>

  /**
   * The resolved data schema that is used to validate the data that is passed
   * to the node when it is executed. The data schema is resolved from the
   * defineDataSchema function of the node.
   *
   * @example
   * {
   *   json: {
   *     name: 'JSON',
   *     type: typeString,
   *     description: 'The JSON data to parse into a JavaScript object.',
   *   },
   * }
   */
  dataSchema: FlowSchema extends Data ? any : Data

  /**
   * The resolved result schema that is used to validate the result that is
   * produced by the node when it is executed. The result schema is resolved
   * from the defineResultSchema function of the node.
   *
   * @example
   * {
   *   object: {
   *     name: 'Object',
   *     type: typeObject,
   *     description: 'The JavaScript object that was parsed from the JSON data.',
   *   },
   * }
   */
  resultSchema: FlowSchema extends Result ? any : Result

  /**
   * Secrets that are passed to the node when it is executed. The secrets
   * are configured per-flow and can be used to provide sensitive information
   * such as API keys or passwords to the flow node.
   *
   * @example
   * {
   *   API_KEY: '123',
   *   PASSWORD: 'password',
   * }
   */
  secrets: Record<string, string>

  /**
   * The variables that are passed to the node when it is executed. The variables
   * are configured per-flow and can be used to provide environment-specific
   * information such as the API URL or the environment name to the flow node.
   *
   * @example
   * {
   *   API_URL: 'https://api.example.com',
   *   NODE_ENV: 'production',
   * }
   */
  variables: Record<string, string>

  /**
   * The abort signal that can be triggered to cancel the execution of the
   * flow node. When the abort signal is triggered, this node should stop
   * processing the data and abort it's execution.
   *
   * @example
   *
   * const node = defineFlowNode({
   *   ...
   *   process: ({ abortSignal }) => {
   *     fetch('https://api.example.com/data', { signal: abortSignal })
   *   },
   * })
   */
  abortSignal: AbortSignal
}

/**
 * The options that are used to define a flow node. The options contain the
 * name, label, icon, description, initial data, data schema, result schema,
 * and the process function of the flow node.
 *
 * @template D The schema of the data that the node expects.
 * @template R The schema of the result that the node produces.
 */
export interface FlowNode<
  K extends string = string,
  D extends FlowSchema = FlowSchema,
  R extends FlowSchema = FlowSchema,
> {

  /**
   * The kind of the node. The kind is used to identify the type of the node
   * and should be unique to the module that defines the node.
   *
   * @example 'parse-json'
   */
  kind: K

  /**
   * The name of the node. The name is used to identify the node in the flow
   * editor and should be unique to the node.
   *
   * @example 'JSON Parse'
   */
  name?: string

  /**
   * The icon of the node. The icon is used to represent the node in the flow
   * editor and should be a URL to an image that represents the node.
   *
   * @example 'https://api.iconify.design/carbon:json.svg'
   */
  icon?: string

  /**
   * The label of the node. The label is used to describe the node in the flow
   * editor and should be a human-readable name that describes the node.
   *
   * @example 'Parses JSON data into a JavaScript object.'
   */
  description?: string

  /**
   * The category of the node. The category is used to group the node with
   * other nodes that have a similar purpose and should be unique to the node.
   *
   * @example FlowCategory { ... }
   */
  category?: FlowCategory

  /**
   * A function that defines the schema of the data that the node expects.
   * The schema is used to validate the data that is passed to the node and
   * to provide information about the data that is expected.
   *
   * @returns The schema of the data that the node expects.
   */
  defineDataSchema?: ((context: NoInfer<FlowNodeContext<D, R>>) => D | Promise<D>) | D

  /**
   * A function that defines the schema of the result that the node produces.
   * The schema is used to validate the result that is produced by the node
   * and to provide information about the result that is produced.
   *
   * @returns The schema of the result that the node produces.
   */
  defineResultSchema?: ((context: NoInfer<FlowNodeContext<D, R>>) => Promise<R> | R) | (object & R)

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
  process?: (context: NoInfer<FlowNodeContext<D, R>>) => InferSchemaType<R> | Promise<InferSchemaType<R> | void> | void
}

/**
 * Define a flow node with the given options.
 *
 * @param options The options to define the flow node.
 * @returns A function that creates a new flow node with the given id and initial data.
 * @example
 *
 * // Define a flow node that parses JSON data.
 * const jsonParse = defineFlowNode({
 *   name: 'parse-json',
 *   label: 'JSON Parse',
 *   icon: 'https://api.iconify.design/carbon:json.svg',
 *   description: 'Parses JSON data into a JavaScript object.',
 *
 *   // The node expects a JSON data string as input.
 *   defineDataSchema: () => ({
 *     json: {
 *       name: 'JSON',
 *       type: typeString,
 *       description: 'The JSON data to parse into a JavaScript object.',
 *     },
 *   }),
 *
 *   // The result of the node is the JavaScript object that was parsed from the JSON data.
 *   defineResultSchema: () => ({
 *     object: {
 *       name: 'Object',
 *       type: typeObject,
 *       description: 'The JavaScript object that was parsed from the JSON data.',
 *     },
 *   }),
 *
 *   // Parse the JSON data into a JavaScript object.
 *   process: ({ data }) => ({
 *     object: JSON.parse(data.json),
 *   }),
 * })
 */
export function defineFlowNode<
  N extends string,
  T extends FlowSchema = FlowSchema,
  U extends FlowSchema = FlowSchema,
>(options: FlowNode<N, T, U>): FlowNode<N, T, U> {
  assertNotNil(options)
  assertStringNotEmpty(options.kind)
  return {
    kind: options.kind,
    name: options.name ?? options.kind,
    icon: options.icon,
    category: options.category,
    description: options.description,
    defineDataSchema: options.defineDataSchema ?? {} as T,
    defineResultSchema: options.defineResultSchema ?? {} as U,
    process: options.process,
  }
}
