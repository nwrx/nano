/* eslint-disable sonarjs/todo-tag */
import type { Schema } from 'jsonschema'

type SchemaNumberValue<T extends Schema> =
  T extends { type: 'integer' | 'number' }
    ? T extends { enum: Array<infer U extends number> } ? U
      : T extends { const: infer U extends number } ? U
        : number
    : never

type SchemaStringValue<T extends Schema> =
  T extends { type: 'string' }
    ? T extends { enum: Array<infer U extends string> } ? U
      : T extends { const: infer U extends string } ? U
        : string
    : never

type SchemaBooleanValue<T extends Schema> =
   T extends { type: 'boolean' }
     ? T extends { enum: Array<infer U extends boolean> } ? U
       : T extends { const: infer U extends boolean } ? U
         : boolean
     : never

type SchemaArrayValue<T extends Schema> =
  T extends { type: 'array'; items: infer U extends Schema }
    ? Array<SchemaValue<U>>
    : never

type SchemaObjectValue<T extends Schema> =
  T extends { type: 'object' }
    ? T extends { properties: infer P extends Record<string, Schema> }
      ? { [K in keyof P]: SchemaValue<P[K]> }
      : T extends { additionalProperties: infer AP extends Schema }
        ? { [key: string]: SchemaValue<AP> }
        : T extends { additionalProperties: true }
          ? Record<string, unknown>
          : object
    : never

type SchemaRequired<T extends Schema> =
  T extends { required: true }
    ? never
    : undefined

// TODO: Migrate to `@unshared/validation` for better type inference and validation.
export type SchemaValue<T extends Schema> =
  | SchemaArrayValue<T>
  | SchemaBooleanValue<T>
  | SchemaNumberValue<T>
  | SchemaObjectValue<T>
  | SchemaRequired<T>
  | SchemaStringValue<T>
