/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { OpenAPIV2 } from '@unshared/client/openapi'
import type { MaybeLiteral, MaybePromise, ObjectLike } from '@unshared/types'
import type { OpenAPIV3 } from 'openapi-types'

export const SYMBOL_COMPONENT = Symbol.for('component')

export type InputControl =
  | 'autocomplete'
  | 'radio'
  | 'select'
  | 'slider'
  | 'socket'
  | 'stream'
  | 'text'
  | 'textarea'
  | 'variable'

export type InputSchema = OpenAPIV3.SchemaObject & {
  'x-control'?: MaybeLiteral<InputControl>
  'x-placeholder'?: string
  'x-internal'?: boolean
  'x-optional'?: boolean
  'x-stream'?: boolean
}

export type OutputSchema = OpenAPIV3.SchemaObject & {
  'x-internal'?: boolean
  'x-stream'?: boolean
}

export type InferSchema<T> =
{
  [P in keyof T]:
  T[P] extends { default: any } ? OpenAPIV2.InferSchema<T[P]>
    : T[P] extends { 'x-stream': true } ? AsyncIterable<OpenAPIV2.InferSchema<T[P]>>
      : OpenAPIV2.InferSchema<T[P]> | undefined
}

export interface ProcessContext<
  T extends ObjectLike = ObjectLike,
  U extends ObjectLike = ObjectLike,
> {
  data: T
  result: U
  trace: (data: T) => void
  abortSignal: AbortSignal
}

export type ProcessFunction<T, U> =
  [InferSchema<T>, InferSchema<U>] extends [infer Data extends ObjectLike, infer Result extends ObjectLike]
    ? (context: ProcessContext<Data, Result>) => MaybePromise<Result>
    : never

export interface Component<
  T extends Record<string, InputSchema> = Record<string, InputSchema>,
  U extends Record<string, OutputSchema> = Record<string, OutputSchema>,
> {
  icon?: string
  title?: string
  description?: string
  inputs?: T
  outputs?: U
  process?: ProcessFunction<T, U>
}

export function defineComponent<
  T extends Record<string, InputSchema> = {},
  U extends Record<string, OutputSchema> = {},
>(options: Component<T, U>, process?: ProcessFunction<T, U>): Component {
  return {
    ['@instanceOf']: SYMBOL_COMPONENT,
    icon: options.icon,
    title: options.title,
    description: options.description,
    inputs: options.inputs,
    outputs: options.outputs,
    process,
  } as Component<T, U>
}
