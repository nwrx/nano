/* eslint-disable perfectionist/sort-intersection-types */
/* eslint-disable perfectionist/sort-union-types */
import type { MaybePromise, ObjectLike, UnionMerge } from '@unshared/types'
import type { OpenAPIV3_1 } from 'openapi-types'
import type { Thread } from '../thread'

export const SYMBOL_COMPONENT = Symbol.for('component')
export const SYMBOL_TYPE = Symbol.for('type')

/*************************************************************************/
/* Socket                                                                */
/*************************************************************************/

export interface SchemaType<T = any> { [SYMBOL_TYPE]: T }

export type SchemaControl =
  | 'autocomplete'
  | 'radio'
  | 'select'
  | 'slider'
  | 'table'
  | 'text'
  | 'textarea'
  | 'markdown'
  | 'json'
  | 'tags'
  | 'vault'
  | 'language-model'
  | 'language-model-tool'

export type SchemaXType =
  | 'stream'
  | 'function'
  | 'file'
  | 'language-model'
  | 'language-model-tool'
  | OpenAPIV3_1.NonArraySchemaObjectType
  | OpenAPIV3_1.ArraySchemaObjectType

export interface SchemaOption {
  value: unknown
  label: string
  icon?: string
  description?: string
}

export type Schema = Omit<OpenAPIV3_1.SchemaObject, 'additionalProperties' | 'anyOf' | 'items' | 'oneOf' | 'properties'> & {
  anyOf?: Schema[]
  oneOf?: Schema[]
  properties?: Record<string, Schema>
  additionalProperties?: boolean | Schema
  items?: Schema
  'x-icon'?: string
  'x-type'?: SchemaXType | SchemaType
  'x-default'?: () => any
  'x-yields'?: Schema
  'x-takes'?: readonly Schema[]
  'x-returns'?: Schema
  'x-resolves'?: Schema
  'x-control'?: SchemaControl
  'x-internal'?: boolean
  'x-optional'?: boolean
  'x-slider-min'?: number
  'x-slider-max'?: number
  'x-slider-step'?: number
  'x-options'?: (data: any, query?: string) => MaybePromise<SchemaOption[]>
  'x-enum-labels'?: string[]
  'x-enum-icons'?: string[]
  'x-enum-descriptions'?: string[]
  [SYMBOL_TYPE]?: any
}

/*************************************************************************/
/* Schema                                                                */
/*************************************************************************/

type InferSocketFunctionResult<T> =
  T extends { 'x-returns': infer U extends object; 'x-resolves': infer U extends object } ? MaybePromise<InferSchema<U>>
    :T extends { 'x-returns': infer U extends object; 'x-resolves': infer V extends object } ? InferSchema<U> | Promise<InferSchema<V>>
      : T extends { 'x-returns': infer U extends object } ? InferSchema<U>
        : T extends { 'x-resolves': infer U extends object } ? Promise<InferSchema<U>>
          : any

type InferSocketFunctionParameters<T> =
  T extends { 'x-takes': infer U extends readonly any[] } ? { [P in keyof U]: InferSchema<U[P]> }
    : any[]

type InferSchemaObject<T> =
  & (T extends { properties: infer P extends object; required: Array<infer R extends string> }
    ? (
      & { -readonly [K in keyof P as K extends R ? K : never]: InferSchema<P[K]> }
      & { -readonly [K in keyof P as K extends R ? never : K]?: InferSchema<P[K]> }
    )
    : T extends { properties: infer P extends object }
      ? { -readonly [K in keyof P]?: InferSchema<P[K]> }
      : object)

  // --- Handle additional properties.
    & (T extends { additionalProperties: infer U extends object }
      ? Record<string, InferSchema<U>>
      : T extends { additionalProperties: true }
        ? Record<string, any>
        : T extends { additionalProperties: false }
          ? object
          : Record<string, any>
  )

type InferSchemaArray<T> =
  T extends { items?: infer U extends object } ? Array<InferSchema<U>>
    : unknown[]

type InferSchemaStream<T> =
  T extends { 'x-yields': infer U extends object } ? ReadableStream<InferSchema<U>>
    : ReadableStream

export type InferSchema<T> =
  | (T extends { nullable: true } ? null : never)
  | (T extends { 'x-optional': true } ? undefined : never)
  | (T extends { anyOf: Array<infer U> } ? InferSchema<U>
    : T extends { oneOf: Array<infer U> } ? InferSchema<U>
      : T extends { allOf: Array<infer U> } ? UnionMerge<InferSchema<U>>
        : T extends { enum: Array<infer U> } ? U
          : T extends { const: infer U } ? U
            : T extends { type: 'array' } ? InferSchemaArray<T>
              : T extends { type: 'object' } ? InferSchemaObject<T>
                : T extends { type: 'string' } ? string
                  : T extends { type: 'integer' | 'number' } ? number
                    : T extends { type: 'boolean' } ? boolean
                      : T extends { 'x-type': 'file' } ? File
                        : T extends { 'x-type': 'stream' } ? InferSchemaStream<T>
                          : T extends { 'x-type': 'function' } ? (...parameters: InferSocketFunctionParameters<T>) => InferSocketFunctionResult<T>
                            : T extends SchemaType<infer U> ? U
                              : unknown)

export type InferSchemaRecord<T> = {
  [P in keyof T]: InferSchema<T[P]>
}

/*************************************************************************/
/* Process                                                               */
/*************************************************************************/

export type ProcessContext<
  Data extends ObjectLike = ObjectLike,
  IsTrusted extends boolean = boolean,
> = IsTrusted extends true
  ? { data: Data; nodeId: string; thread: Thread }
  : { data: Data }

export type ProcessFunction<
  Inputs extends Record<string, Schema> = Record<string, Schema>,
  Outputs extends Record<string, Schema> = Record<string, Schema>,
  IsTrusted extends boolean = boolean,
> =
  [InferSchemaRecord<Inputs>, InferSchemaRecord<Outputs>] extends [infer Data extends ObjectLike, infer Result extends ObjectLike]
    ? (context: ProcessContext<Data, IsTrusted>) => MaybePromise<Result>
    : (context: ProcessContext) => MaybePromise<ObjectLike>

/*************************************************************************/
/* Component                                                             */
/*************************************************************************/

export interface ComponentOptions<
  Inputs extends Record<string, Schema> = Record<string, Schema>,
  Outputs extends Record<string, Schema> = Record<string, Schema>,
  IsTrusted extends boolean = boolean,
> {
  inputs?: Inputs
  outputs?: Outputs

  /**
   * If `true`, the component will be considered as trusted and will be allowed to
   * run in an un-sandboxed environment. This is useful for components that are part of the core
   * library and are considered safe to run. By default, all components are considered untrusted
   * and will run in an isolated and sandboxed environment powered by `isolated-vm`.
   */
  isTrusted?: IsTrusted

  /**
   * If `true`, the component is expected to only return a tool or a collection of tools.
   */
  isToolSet?: boolean
}

export interface Component<
  Inputs extends Record<string, Schema> = Record<string, Schema>,
  Outputs extends Record<string, Schema> = Record<string, Schema>,
  IsTrusted extends boolean = boolean,
> extends ComponentOptions<Inputs, Outputs> {
  ['@instanceOf']: typeof SYMBOL_COMPONENT
  process?: ProcessFunction<Inputs, Outputs, IsTrusted>
}

export function defineComponent<
  Inputs extends Record<string, Schema>,
  Outputs extends Record<string, Schema>,
  IsTrusted extends boolean = false,
>(
  options: ComponentOptions<Inputs, Outputs, IsTrusted>,
  process?: ProcessFunction<Inputs, Outputs, IsTrusted>,
): Component<Inputs, Outputs, IsTrusted> {
  return {
    ['@instanceOf']: SYMBOL_COMPONENT,
    inputs: options.inputs,
    outputs: options.outputs,
    isTrusted: options.isTrusted,
    isToolSet: options.isToolSet,
    process,
  } as Component<Inputs, Outputs>
}
