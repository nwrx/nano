import type { OpenAPIV2 } from '@unshared/client/openapi'
import type { MaybeLiteral, MaybePromise } from '@unshared/types'
import type { OpenAPIV3 } from 'openapi-types'

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
}

export type OutputSchema = OpenAPIV3.SchemaObject & {
  'x-internal'?: boolean
}

export type InferSchema<T> =
{
  [P in keyof T]:
  T[P] extends { default: any }
    ? OpenAPIV2.InferSchema<T[P]>
    : OpenAPIV2.InferSchema<T[P]> | undefined
}

export interface ProcessContext<T, U> {
  data: T
  result: U
  trace: (data: any) => void
  abortSignal: AbortSignal
}

export type ProcessFunction<T, U> =
  [InferSchema<T>, InferSchema<U>] extends [infer Data, infer Result]
    ? (context: ProcessContext<Data, Result>) => MaybePromise<Result>
    : never

export interface Component<
  N extends string = string,
  T extends Record<string, InputSchema> = Record<string, InputSchema>,
  U extends Record<string, OutputSchema> = Record<string, OutputSchema>,
> {
  name: N
  icon?: string
  title?: string
  description?: string
  inputs?: T
  outputs?: U
  process?: ProcessFunction<T, U>
}

export function defineComponent<
  K extends string,
  T extends Record<string, InputSchema>,
  U extends Record<string, OutputSchema>,
>(options: Component<K, T, U>, process?: ProcessFunction<T, U>): Component<K, T, U> {
  return {
    name: options.name,
    icon: options.icon,
    title: options.title ?? options.name,
    description: options.description,
    inputs: options.inputs,
    outputs: options.outputs,
    process,
  } as Component<K, T, U>
}
