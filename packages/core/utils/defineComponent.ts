import type { OpenAPIV2 } from '@unshared/client/openapi'
import type { MaybePromise, ObjectLike } from '@unshared/types'
import type { OpenAPIV3 } from 'openapi-types'

export const SYMBOL_COMPONENT = Symbol.for('component')

export type InputControl =
  | 'autocomplete'
  | 'radio'
  | 'select'
  | 'slider'
  | 'table'
  | 'text'
  | 'textarea'
  | 'variable'

export interface InputOption {
  value: unknown
  label: string
  icon?: string
  description?: string
}

export type SocketSchema = Omit<OpenAPIV3.SchemaObject, 'additionalProperties' | 'anyOf' | 'items' | 'oneOf' | 'properties'> & {
  anyOf?: SocketSchema[]
  oneOf?: SocketSchema[]
  properties?: Record<string, SocketSchema>
  additionalProperties?: boolean | SocketSchema
  items?: SocketSchema
  'x-type'?: 'function' | 'stream'
  'x-returns'?: OpenAPIV3.SchemaObject
  'x-resolves'?: OpenAPIV3.SchemaObject
  'x-control'?: InputControl
  'x-placeholder'?: string
  'x-internal'?: boolean
  'x-optional'?: boolean
  'x-options'?: (data: any, query?: string) => MaybePromise<InputOption[]>
}

export type InferSchema<T> =
{
  [P in keyof T]:
  T[P] extends { default: any } ? OpenAPIV2.InferSchema<T[P]>
    : T[P] extends { 'x-type': 'stream' } ? ReadableStream
      : T[P] extends { 'x-type': 'function'; 'x-returns': infer U } ? (...args: any[]) => OpenAPIV2.InferSchema<U>
        : T[P] extends { 'x-type': 'function'; 'x-resolves': infer U } ? (...args: any[]) => Promise<OpenAPIV2.InferSchema<U>>
          : OpenAPIV2.InferSchema<T[P]> | undefined
}

export interface ProcessContext<T extends ObjectLike = ObjectLike> {
  data: T
  trace: (data: T) => void
}

export type ProcessFunction<
  T extends Record<string, SocketSchema> = Record<string, SocketSchema>,
  U extends Record<string, SocketSchema> = Record<string, SocketSchema>,
> =
  [InferSchema<T>, InferSchema<U>] extends [infer Data extends ObjectLike, infer Result extends ObjectLike]
    ? (context: ProcessContext<Data>) => MaybePromise<Result>
    : (context: ProcessContext) => MaybePromise<ObjectLike>

export interface ComponentOptions<
  T extends Record<string, SocketSchema> = Record<string, SocketSchema>,
  U extends Record<string, SocketSchema> = Record<string, SocketSchema>,
> {
  icon?: string
  title?: string
  description?: string
  inputs?: T
  outputs?: U
}

export interface Component<
  T extends Record<string, SocketSchema> = Record<string, SocketSchema>,
  U extends Record<string, SocketSchema> = Record<string, SocketSchema>,
> extends ComponentOptions<T, U> {
  ['@instanceOf']: typeof SYMBOL_COMPONENT
  process?: ProcessFunction<any, any>
}

export function defineComponent<
  T extends Record<string, SocketSchema>,
  U extends Record<string, SocketSchema>,
>(options: ComponentOptions<T, U>, process?: ProcessFunction<T, U>): Component<any, any> {
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
