import type { Type } from './defineType'

export interface OutputSocket<T = unknown> {
  type: Type<T>
  name?: string
  description?: string
  isInternal?: boolean
  isOptional?: boolean
  isIterable?: boolean
  isMap?: boolean
}

export type OutputSchema = Record<string, OutputSocket>

export type InferOutput<T extends OutputSchema> =
{ [P in keyof T]:
  T[P] extends { [x: string]: any; type: Type<infer U>; isOptional: true; isIterable: true } ? U[] | undefined :
    T[P] extends { [x: string]: any; type: Type<infer U>; isOptional: true; isMap: true } ? Record<string, U> | undefined :
      T[P] extends { [x: string]: any; type: Type<infer U>; isOptional: true } ? U | undefined :
        T[P] extends { [x: string]: any; type: Type<infer U>; isIterable: true } ? U[] :
          T[P] extends { [x: string]: any; type: Type<infer U>; isMap: true } ? Record<string, U> :
            T[P] extends { [x: string]: any; type: Type<infer U> } ? U : unknown
}

export function defineOutputSchema<T extends OutputSchema>(schema: Readonly<T>): T {
  return schema
}
