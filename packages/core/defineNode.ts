import type { MaybePromise, ObjectLike } from '@unshared/types'
import type { Category } from './defineCategory'
import type { DataFromSchema, DataSchema } from './defineDataSchema'
import type { ResultFromSchema, ResultSchema } from './defineResultSchema'
import { assertNotNil, assertStringNotEmpty } from '@unshared/validation'

/**
 * The parameters passed to the process function of a flow node. The parameters
 * contain the input values and additional parameters that can be used to
 * process the data.
 */
export interface InstanceContext<
  T extends ObjectLike = ObjectLike,
  U extends ObjectLike = ObjectLike,
> {

  /**
   * The data that is passed to the node when it is executed. The data comes
   * from the previous nodes or can be statically defined in the flow.
   */
  data: T

  /**
   * The current result that is produced by the node when it is executed. The
   * result is used to pass the output of the node to the next nodes in the flow.
   * The result can be modified by the node to produce the desired output.
   */
  result: U

  /**
   * The abort signal that can be triggered to cancel the execution of the
   * flow node. When the abort signal is triggered, this node should stop
   * processing the data and abort it's execution.
   *
   * @example
   *
   * const node = defineNode({
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
 * @template K The kind of the node. The kind is used to identify the type of the node.
 * @template T The schema of the data that the node expects.
 * @template U The schema of the result that the node produces.
 */
export interface Node<
  K extends string = string,
  T extends DataSchema = DataSchema,
  U extends ResultSchema = ResultSchema,
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
  category?: Category

  /**
   * A function that defines the schema of the data that the node expects.
   * The schema is used to validate the data that is passed to the node and
   * to provide information about the data that is expected.
   *
   * @returns The schema of the data that the node expects.
   */
  dataSchema?: T

  /**
   * A function that defines the schema of the result that the node produces.
   * The schema is used to validate the result that is produced by the node
   * and to provide information about the result that is produced.
   *
   * @returns The schema of the result that the node produces.
   */
  resultSchema?: U

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
  process?: (context: InstanceContext<
    DataFromSchema<NoInfer<T>>,
    ResultFromSchema<NoInfer<U>>
  >) => MaybePromise<ResultFromSchema<U>>
}

/**
 * Define a flow node with the given options.
 *
 * @param options The options to define the flow node.
 * @returns A function that creates a new flow node with the given id and initial data.
 * @example
 *
 * // Define a flow node that parses JSON data.
 * const jsonParse = defineNode({
 *   name: 'parse-json',
 *   label: 'JSON Parse',
 *   icon: 'https://api.iconify.design/carbon:json.svg',
 *   description: 'Parses JSON data into a JavaScript object.',
 *
 *   // The node expects a JSON data string as input.
 *   dataSchema: () => ({
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
export function defineNode<K extends string, T extends DataSchema, U extends ResultSchema>(options: Node<K, T, U>): Node<K, T, U> {
  assertNotNil(options)
  assertStringNotEmpty(options.kind)
  return {
    kind: options.kind,
    name: options.name ?? options.kind,
    icon: options.icon,
    category: options.category,
    description: options.description,
    dataSchema: options.dataSchema,
    resultSchema: options.resultSchema,
    process: options.process,
  } as Node<K, T, U>
}
