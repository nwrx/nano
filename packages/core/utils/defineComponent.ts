import type { OpenAPIV2 } from '@unshared/client/openapi'
import type { MaybeLiteral, MaybePromise } from '@unshared/types'
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
  T extends Record<string, InputSchema> = Record<string, InputSchema>,
  U extends Record<string, OutputSchema> = Record<string, OutputSchema>,
> {
  name: string
  version: string
  icon?: string
  title?: string
  description?: string
  inputs?: T
  outputs?: U
  process?: ProcessFunction<T, U>
}

export function defineComponent<
  T extends Record<string, InputSchema>,
  U extends Record<string, OutputSchema>,
>(options: Component<T, U>, process?: ProcessFunction<T, U>): Component< T, U> {
  return {
    [SYMBOL_COMPONENT]: true,
    name: options.name,
    version: options.version,
    icon: options.icon,
    title: options.title ?? options.name,
    description: options.description,
    inputs: options.inputs,
    outputs: options.outputs,
    process,
  } as Component<T, U>
}
