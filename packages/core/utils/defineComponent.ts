/* eslint-disable perfectionist/sort-intersection-types */
/* eslint-disable perfectionist/sort-union-types */
import type { MaybePromise, ObjectLike, UnionMerge } from '@unshared/types'
import type { OpenAPIV3 } from 'openapi-types'
import type { ConfirmOption } from './askConfirmation'
import type { QuestionOptions } from './askQuestion'
import type { NotifyActionOptions } from './notifyAction'

export const SYMBOL_COMPONENT = Symbol.for('component')

/*************************************************************************/
/* Socket                                                                */
/*************************************************************************/

export type SchemaControl =
  | 'autocomplete'
  | 'radio'
  | 'select'
  | 'slider'
  | 'table'
  | 'text'
  | 'textarea'
  | 'variable'

export interface SchemaOption {
  value: unknown
  label: string
  icon?: string
  description?: string
}

export type Schema = Omit<OpenAPIV3.SchemaObject, 'additionalProperties' | 'anyOf' | 'items' | 'oneOf' | 'properties'> & {
  anyOf?: Schema[]
  oneOf?: Schema[]
  properties?: Record<string, Schema>
  additionalProperties?: boolean | Schema
  items?: Schema
  'x-icon'?: string
  'x-type'?: 'function' | 'stream'
  'x-default'?: () => any
  'x-takes'?: readonly Schema[]
  'x-returns'?: Schema
  'x-resolves'?: Schema
  'x-control'?: SchemaControl
  'x-placeholder'?: string
  'x-internal'?: boolean
  'x-optional'?: boolean
  'x-slider-min'?: number
  'x-slider-max'?: number
  'x-slider-step'?: number
  'x-options'?: (data: any, query?: string) => MaybePromise<SchemaOption[]>
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
      & { [K in keyof P as K extends R ? K : never]: InferSchema<P[K]> }
      & { [K in keyof P as K extends R ? never : K]?: InferSchema<P[K]> }
    )
    : T extends { properties: infer P extends object }
      ? { [K in keyof P]?: InferSchema<P[K]> }
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

export type InferSchema<T> =
  | (T extends { nullable: true } ? null : never)
  | (T extends { 'x-optional': true } ? undefined : never)
  | (T extends { anyOf: Array<infer U> } ? InferSchema<U>
    : T extends { oneOf: Array<infer U> } ? InferSchema<U>
      : T extends { allOf: Array<infer U> } ? UnionMerge<InferSchema<U>>
        : T extends { enum: Array<infer U> } ? U
          : T extends { type: 'array' } ? InferSchemaArray<T>
            : T extends { type: 'object' } ? InferSchemaObject<T>
              : T extends { type: 'string' } ? string
                : T extends { type: 'integer' | 'number' } ? number
                  : T extends { type: 'boolean' } ? boolean
                    : T extends { 'x-type': 'stream' } ? ReadableStream
                      : T extends { 'x-type': 'function' } ? (...parameters: InferSocketFunctionParameters<T>) => InferSocketFunctionResult<T>
                        : unknown)

export type InferSchemaRecord<T> = {
  [P in keyof T]: InferSchema<T[P]>
}

/*************************************************************************/
/* Process                                                               */
/*************************************************************************/

export interface ProcessContext<T extends ObjectLike = ObjectLike> {
  data: T
  notifyAction: (options: NotifyActionOptions) => void
  askQuestion: (options: QuestionOptions) => Promise<boolean | number | ObjectLike | string | unknown[]>
  askConfirmation: (options: ConfirmOption) => Promise<boolean>
  abortSignal: AbortSignal
}

export type ProcessFunction<
  T extends Record<string, Schema> = Record<string, Schema>,
  U extends Record<string, Schema> = Record<string, Schema>,
> =
  [InferSchemaRecord<T>, InferSchemaRecord<U>] extends [infer Data extends ObjectLike, infer Result extends ObjectLike]
    ? (context: ProcessContext<Data>) => MaybePromise<Result>
    : (context: ProcessContext) => MaybePromise<ObjectLike>

/*************************************************************************/
/* Component                                                             */
/*************************************************************************/

export interface ComponentOptions<
  T extends Record<string, Schema> = Record<string, Schema>,
  U extends Record<string, Schema> = Record<string, Schema>,
> {
  icon?: string
  title?: string
  description?: string
  inputs?: T
  outputs?: U

  /**
   * If `true`, the component will be considered as trusted and will be allowed to
   * run in an un-sandboxed environment. This is useful for components that are part of the core
   * library and are considered safe to run. By default, all components are considered untrusted
   * and will run in an isolated and sandboxed environment powered by `isolated-vm`.
   */
  isTrusted?: boolean
}

export interface Component<
  T extends Record<string, Schema> = Record<string, Schema>,
  U extends Record<string, Schema> = Record<string, Schema>,
> extends ComponentOptions<T, U> {
  ['@instanceOf']: typeof SYMBOL_COMPONENT
  process?: ProcessFunction<any, any>
}

export function defineComponent<
  T extends Record<string, Schema>,
  U extends Record<string, Schema>,
>(options: ComponentOptions<T, U>, process?: ProcessFunction<T, U>): Component<T, U> {
  return {
    ['@instanceOf']: SYMBOL_COMPONENT,
    icon: options.icon,
    title: options.title,
    description: options.description,
    inputs: options.inputs,
    outputs: options.outputs,
    isTrusted: options.isTrusted,
    process,
  } as Component<T, U>
}
