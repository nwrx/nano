/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { MaybePromise, Pretty } from '@unshared/types'
import type { Flow } from './createFlow'
import type { FlowCategory } from './defineFlowCategory'
import type { FlowType, FlowTypeJSON } from './defineFlowType'
import type { InferSchemaType } from './types'
import { mapValues } from '@unshared/collection'
import { assertStringNotEmpty } from '@unshared/validation'

export type FlowNodePortDisplay =
  | 'password'
  | 'select'
  | 'slider'
  | 'stream'
  | 'switch'
  | 'text'
  | 'textarea'
  | 'toggle'

/**
 * A schema that contains the ports of a flow. It allows the definition of
 * the label as well as the type of the port that is used in the flow.
 */
export interface FlowNodePort<T = any> {
  name: string
  type: FlowType<T>
  display?: FlowNodePortDisplay
  description?: string
  defaultValue?: T
  disallowStatic?: boolean
  disallowDynamic?: boolean
  values?: Record<string, T> | T[]
  numberMax?: number
  numberMin?: number
  numberStep?: number
}

export interface FlowNodePortJSON {
  name: string
  type: FlowTypeJSON
  display?: FlowNodePortDisplay
  description?: string
  defaultValue?: unknown
  disallowStatic?: boolean
  disallowDynamic?: boolean
  disallowEnvironment?: boolean
  values?: Record<string, unknown> | unknown[]
  numberMax?: number
  numberMin?: number
  numberStep?: number
}

/** The serialized representation of a flow node. */
export interface FlowNodeJSON {
  kind: string
  name?: string
  icon?: string
  category?: string
  description?: string
  dataSchema?: Record<string, FlowNodePortJSON>
  resultSchema?: Record<string, FlowNodePortJSON>
}

/**
 * A schema that contains a mapping of the ports of a flow. It allows the
 * definition of the ports and their types that are used in the flow.
 */
export type FlowSchema = Record<string, FlowNodePort>

/**
 * The serialized representation of a flow schema. It contains the mapping
 * of the ports of a flow and their types that are used in the flow.
 */
export type FlowSchemaJSON = Record<string, FlowNodePortJSON>

/**
 * The parameters passed to the process function of a flow node. The parameters
 * contain the input values and additional parameters that can be used to
 * process the data.
 */
export interface FlowNodeContext<
  Data extends FlowSchema,
  Result extends FlowSchema,
> {

  /**
   * The flow which the node is a part of. The flow contains all the nodes and
   * the connections between the nodes that are used to process the data.
   */
  readonly flow: Flow

  /**
   * The data that is passed to the node when it is executed. The data comes
   * from the previous nodes or can be statically defined in the flow.
   */
  readonly data: Partial<Pretty<InferSchemaType<Data>>>

  /**
   * The current result that is produced by the node when it is executed. The
   * result is used to pass the output of the node to the next nodes in the flow.
   * The result can be modified by the node to produce the desired output.
   */
  readonly result: Partial<Pretty<InferSchemaType<Result>>>

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
  readonly dataSchema: Readonly<Data>

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
  readonly resultSchema: Readonly<Result>

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
  readonly secrets: Record<string, string>

  /**
   * Parameters that are passed to the node when it is executed. The
   * parameters are provided when calling the flow and can be used to
   * contextualize the execution of the node with additional information
   * such as the user id or the origin of the request.
   *
   * @example
   * {
   *   userId: '123',
   *   siteOrigin: 'Business',
   * }
   */
  readonly parameters: Record<string, unknown>

  /**
   * The environment that is passed to the node when it is executed. The
   * environment can be used to provide additional information about the
   * execution environment of the flow node.
   *
   * @example
   * {
   *   API_URL: 'https://api.example.com',
   *   NODE_ENV: 'production',
   * }
   */
  readonly environment: Record<string, string>

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
  readonly abortSignal: AbortSignal
}

/**
 * The options that are used to define a flow node. The options contain the
 * name, label, icon, description, initial data, data schema, result schema,
 * and the process function of the flow node.
 *
 * @template Data The schema of the data that the node expects.
 * @template Result The schema of the result that the node produces.
 */
export interface FlowNodeOptions<
  Kind extends string = string,
  Data extends FlowSchema = FlowSchema,
  Result extends FlowSchema = FlowSchema,
> {

  /**
   * The kind of the node. The kind is used to identify the type of the node
   * and should be unique to the module that defines the node.
   *
   * @example 'json-parse'
   */
  kind: Kind

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
  defineDataSchema: ((context: FlowNodeContext<FlowSchema, FlowSchema>) => MaybePromise<Data>) | Data

  /**
   * A function that defines the schema of the result that the node produces.
   * The schema is used to validate the result that is produced by the node
   * and to provide information about the result that is produced.
   *
   * @returns The schema of the result that the node produces.
   */
  defineResultSchema: ((context: FlowNodeContext<Data, Result>) => MaybePromise<Result>) | Result

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
  process: (context: FlowNodeContext<Data, Result>) => InferSchemaType<Result> | Promise<InferSchemaType<Result> | void> | void
}

/**
 * A flow node that can be used in a flow to process data. It is the basic
 * building block of a flow that can be connected to other nodes to create
 * a flow of nodes that process data in a sequence.
 *
 * @template T The schema of the data that the node expects.
 * @template U The schema of the result that the node produces.
 */
export interface FlowNode<
  N extends string = string,
  T extends FlowSchema = FlowSchema,
  U extends FlowSchema = FlowSchema,
> extends FlowNodeOptions<N, T, U> {

  /**
   * The unique identifier of the node. The identifier is used to identify
   * the node in the flow and should be unique to the node.
   */
  toString(): N

  /**
   * A function that returns the serialized representation of the node.
   *
   * @returns The serialized representation of the node.
   * @example node.toJSON() // { name: 'json-parse', icon: 'https://api.iconify.design/carbon:json.svg', label: 'JSON Parse' }
   */
  toJSON(): FlowNodeJSON
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
 *   name: 'json-parse',
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
  N extends string = string,
  T extends FlowSchema = {},
  U extends FlowSchema = {},
>(options: FlowNodeOptions<N, T, U>): FlowNode<N, T, U> {
  assertStringNotEmpty(options.kind)
  return {
    kind: options.kind,
    name: options.name,
    icon: options.icon,
    category: options.category,
    description: options.description,
    defineDataSchema: options.defineDataSchema ?? {},
    defineResultSchema: options.defineResultSchema ?? {},
    process: options.process,
    toString() {
      return options.kind
    },
    toJSON() {
      const dataSchema = typeof options.defineDataSchema === 'function'
        ? {}
        : mapValues(options.defineDataSchema, port => ({ ...port, type: port.type.toJSON() }))

      const resultSchema = typeof options.defineResultSchema === 'function'
        ? {}
        : mapValues(options.defineResultSchema, port => ({ ...port, type: port.type.toJSON() }))

      return {
        kind: options.kind,
        name: options.name,
        icon: options.icon,
        category: options.category?.kind,
        description: options.description,
        dataSchema,
        resultSchema,
      }
    },
  }
}

/* v8 ignore start */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
if (import.meta.vitest) {
  const { typeString, typeObject } = await import('./__fixtures__')

  test('should define a flow node with the given options', () => {
    const defineDataSchema = vi.fn()
    const defineResultSchema = vi.fn()
    const process = vi.fn()

    const node = defineFlowNode({
      kind: 'node',
      name: 'Node',
      icon: 'https://api.iconify.design/carbon:json.svg',
      description: 'Parses JSON data into a JavaScript object.',
      defineDataSchema,
      defineResultSchema,
      process,
    })

    expect(node).toStrictEqual({
      kind: 'node',
      name: 'Node',
      icon: 'https://api.iconify.design/carbon:json.svg',
      description: 'Parses JSON data into a JavaScript object.',
      defineDataSchema,
      defineResultSchema,
      process,
      toJSON: expect.any(Function),
      toString: expect.any(Function),
    })
  })

  test('should return a serialized representation of the node', () => {
    const node = defineFlowNode({
      kind: 'node',
      name: 'Node',
      icon: 'https://api.iconify.design/carbon:json.svg',
      description: 'Parses JSON data into a JavaScript object.',
      defineDataSchema: {
        json: {
          name: 'JSON',
          type: typeString,
          description: 'The JSON data to parse into a JavaScript object.',
        },
      },
      defineResultSchema: {
        object: {
          name: 'Object',
          type: typeObject,
          description: 'The JavaScript object that was parsed from the JSON data.',
        },
      },
      process: () => ({
        object: {},
      }),
    })

    const result = node.toJSON()
    expect(result).toStrictEqual({
      kind: 'node',
      name: 'Node',
      icon: 'https://api.iconify.design/carbon:json.svg',
      description: 'Parses JSON data into a JavaScript object.',
      dataSchema: {
        json: {
          name: 'JSON',
          type: typeString.toJSON(),
          description: 'The JSON data to parse into a JavaScript object.',
        },
      },
      resultSchema: {
        object: {
          name: 'Object',
          type: typeObject.toJSON(),
          description: 'The JavaScript object that was parsed from the JSON data.',
        },
      },
    })
  })
}
