import type { MaybeLiteral, MaybePromise, ObjectLike } from '@unshared/types'
import type { Type } from './defineType'

export type SocketControl =
  | 'autocomplete'
  | 'radio'
  | 'select'
  | 'slider'
  | 'socket'
  | 'stream'
  | 'text'
  | 'textarea'
  | 'variable'

export interface SocketListOption<T = any> {
  value: T
  label: string
  icon?: string
  description?: string
}

export type DataSocketOptions<T = any> = Array<SocketListOption<T>>

export interface InputSocket<T = unknown> {
  control?: MaybeLiteral<SocketControl>
  options?: ((input: ObjectLike, query?: string) => MaybePromise<DataSocketOptions<T>>) | DataSocketOptions<T>
  sliderMax?: number
  sliderMin?: number
  sliderStep?: number
  placeholder?: string
  defaultValue?: NoInfer<T>
  type: Type<T>
  name?: string
  description?: string
  isInternal?: boolean
  isOptional?: boolean
  isIterable?: boolean
  isMap?: boolean
}

export type InputSchema = Record<string, InputSocket>

export type InferInput<T extends InputSchema> =
  { [P in keyof T]:
    T[P] extends { [x: string]: any; type: Type<infer U>; isOptional: true; isIterable: true } ? U[] | undefined :
      T[P] extends { [x: string]: any; type: Type<infer U>; isOptional: true; isMap: true } ? Record<string, U> | undefined :
        T[P] extends { [x: string]: any; type: Type<infer U>; isOptional: true } ? U | undefined :
          T[P] extends { [x: string]: any; type: Type<infer U>; isIterable: true } ? U[] :
            T[P] extends { [x: string]: any; type: Type<infer U>; isMap: true } ? Record<string, U> :
              T[P] extends { [x: string]: any; type: Type<infer U> } ? U : unknown
  }

export function defineInputSchema<T extends InputSchema>(schema: Readonly<T>): T {
  return schema
}
