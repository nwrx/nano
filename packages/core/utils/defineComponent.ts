import type { OpenAPIV2 } from '@unshared/client/openapi'
import type { MaybePromise, ObjectLike } from '@unshared/types'
import type { OpenAPIV3 } from 'openapi-types'
import type { ConfirmOption } from './askConfirmation'
import type { QuestionOptions } from './askQuestion'
import type { NotifyActionOptions } from './notifyAction'

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
  'x-default'?: () => any
  'x-returns'?: OpenAPIV3.SchemaObject
  'x-resolves'?: OpenAPIV3.SchemaObject
  'x-control'?: InputControl
  'x-placeholder'?: string
  'x-internal'?: boolean
  'x-optional'?: boolean
  'x-slider-min'?: number
  'x-slider-max'?: number
  'x-slider-step'?: number
  'x-options'?: (data: any, query?: string) => MaybePromise<InputOption[]>
}

export type InferSocketType<T> =
 | (T extends { 'x-optional': true } ? undefined : never)
 | (T extends { default: any } ? OpenAPIV2.InferSchema<T>
   : T extends { 'x-type': 'stream' } ? ReadableStream
     : T extends { 'x-type': 'function'; 'x-returns': infer U } ? (...args: any[]) => OpenAPIV2.InferSchema<U>
       : T extends { 'x-type': 'function'; 'x-resolves': infer U } ? (...args: any[]) => Promise<OpenAPIV2.InferSchema<U>>
         : OpenAPIV2.InferSchema<T>)

export type InferSchema<T> = {
  [P in keyof T]: InferSocketType<T[P]>
}

export interface ProcessContext<T extends ObjectLike = ObjectLike> {
  data: T
  notifyAction: (options: NotifyActionOptions) => void
  askQuestion: (options: QuestionOptions) => Promise<boolean | number | ObjectLike | string | unknown[]>
  askConfirmation: (options: ConfirmOption) => Promise<boolean>
  abortSignal: AbortSignal
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

  /**
   * If `true`, the component will be considered as trusted and will be allowed to
   * run in an un-sandboxed environment. This is useful for components that are part of the core
   * library and are considered safe to run. By default, all components are considered untrusted
   * and will run in an isolated and sandboxed environment powered by `isolated-vm`.
   */
  isTrusted?: boolean
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
    isTrusted: options.isTrusted,
    process,
  } as Component<T, U>
}
