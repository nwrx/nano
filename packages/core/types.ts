import { Pretty } from 'unshared'
import { ChainType } from './defineChainType'
import { ChainNode, ChainNodePort } from './defineChainNode'

/**
 * A schema that contains the edges of a chain.
 */
export type Schema = Record<string, ChainNodePort>

/**
 * Extract the type of the given `ChainType` instance.
 *
 * @template T The `ChainType` instance to extract the type from.
 * @example
 * type Type = ChainType<string>
 * type Result = InferType<Type> // string
 */
export type InferType<T> = T extends ChainType<infer U> ? U : never

/**
 * Extract the type of the given `ChainNodePort` instance.
 *
 * @template T The `ChainNodePort` instance to extract the type from.
 * @example
 * type Port = ChainNodePort<string>
 * type PortType = InferPortType<Port> // string
 */
export type InferPortType<T extends ChainNodePort> = T extends ChainNodePort<infer U> ? U : never

/**
 * Infer the raw type contained in a `ChainNodeSchema` schema. The raw type is
 * the type that is parsed from the schema and used in the chain.
 *
 * @template T The schema to infer the raw type from.
 * @example
 * type Schema = { value: ChainNodePort<string>; other: ChainNodePort<number> }
 * type RawType = InferRawType<Schema> // { value: string; other: number }
 */
export type InferSchemaType<T extends Schema> = Pretty<{ [K in keyof T]: InferPortType<T[K]> }>

/**
 * Infer the keys of a schema. The keys are the names of the edges in the schema.
 *
 * @template T The schema to infer the keys from.
 * @example
 * type Schema = { value: { ... }; other: { ... } }
 * type Keys = InferSchemaKeys<Schema> // 'value' | 'other'
 */
export type InferSchemaKeys<T extends Schema> = InferSchemaType<T> extends Record<infer K, any> ? K & string : never

/**
 * Infer the value type of a schema by its key. The value type is the type that
 * is parsed from the schema and used in the chain.
 *
 * @template T The schema to infer the value type from.
 * @template K The key of the schema to infer the value type from.
 * @example
 * type Schema = { value: { name: 'Value', type: TypePrimitiveString } }
 * type ValueType = InferValue<Schema, 'value'> // string
 */
export type InferSchemaValue<T extends Schema, K extends InferSchemaKeys<T>> = InferSchemaType<T>[K]

/**
 * Given a `ChainNode` instance, infer the schema of the data that the node
 * requires. The schema is the type that is parsed from the schema and used in
 * the chain.
 *
 * @template T The `ChainNode` instance to infer the data schema from.
 * @example
 * class Node extends ChainNode {
 *   defineDataSchema() {
 *    return {
 *     value: { name: 'Value', type: TypePrimitiveString },
 *     other: { name: 'Other', type: TypePrimitiveNumber },
 *   }
 * }
 *
 * type Result = InferDataSchema<Node>
 * // {
 * //   value: { name: 'Value', type: ChainType<string> },
 * //   other: { name: 'Other', type: ChainType<number> },
 * // }
 */
export type InferDataSchema<T extends object> =
  T extends ChainNode<infer U, any> ? U : never

/**
 * Given a `ChainNode` instance, infer the schema of the result that the node
 * produces. The schema is the type that is parsed from the schema and used in
 * the chain.
 *
 * @template T The `ChainNode` instance to infer the result schema from.
 * @example
 * class Node extends ChainNode {
 *   defineResultSchema() {
 *    return {
 *     value: { name: 'Value', type: TypePrimitiveString },
 *     other: { name: 'Other', type: TypePrimitiveNumber },
 *   }
 * }
 *
 * type Result = InferResultSchema<Node>
 * // {
 * //   value: { name: 'Value', type: ChainType<string> },
 * //   other: { name: 'Other', type: ChainType<number> },
 * // }
 */
export type InferResultSchema<T extends object> =
  T extends ChainNode<any, infer U> ? U : never

/**
 * Given a `ChainNode` instance, infer the result type that the node produces.
 *
 * @template T The `ChainNode` instance to infer the result from.
 * @example
 * class Node extends ChainNode {
 *   defineResultSchema() {
 *     return {
 *       value: { name: 'Value', type: TypePrimitiveString },
 *       other: { name: 'Other', type: TypePrimitiveNumber },
 *     }
 *   }
 * }
 *
 * type Result = InferResult<Node> // { value: string; other: number }
 */
export type InferResult<T extends object> = InferSchemaType<InferResultSchema<T>>
export type InferResultKeys<T extends object> = keyof InferResultSchema<T> & string
export type InferResultValue<T extends object, K extends InferResultKeys<T>> = InferResult<T>[K]

export type InferData<T extends object> = InferSchemaType<InferDataSchema<T>>
export type InferDataKeys<T extends object> = keyof InferDataSchema<T> & string
export type InferDataValue<T extends object, K extends InferDataKeys<T>> = InferData<T>[K]

/* v8 ignore start */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
if (import.meta.vitest) {
  const { defineChainNode } = await import('./defineChainNode')
  const { coreTypeString, coreTypeNumber } = await import('../core')

  const node = defineChainNode({
    name: 'node',
    label: 'Node',
    defineDataSchema: () => ({ text: { name: 'Text', type: coreTypeString } }),
    defineResultSchema: () => ({ value: { name: 'Value', type: coreTypeNumber } }),
    process: ({ data }) => ({ value: Number(data.text) }),
  })
  type Node = ReturnType<typeof node>

  describe('common', () => {
    it('should infer the `ChainType` type', () => {
      type Type = ChainType<string>
      type Result = InferType<Type>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })

    it('should infer the raw type of a `ChainNodePort`', () => {
      type Schema = { value: { name: 'Value'; type: ChainType<string> } }
      type Result = InferSchemaType<Schema>
      expectTypeOf<Result>().toEqualTypeOf<{ value: string }>()
    })

    it('should infer the keys of a `ChainNodeSchema`', () => {
      type Schema = { value: { name: 'Value'; type: ChainType<string> } }
      type Result = InferSchemaKeys<Schema>
      expectTypeOf<Result>().toEqualTypeOf<'value'>()
    })

    it('should infer the value type of a `ChainNodeSchema` by its key', () => {
      type Schema = { value: { name: 'Value'; type: ChainType<string> } }
      type Result = InferSchemaValue<Schema, 'value'>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })
  })

  describe('result', () => {
    it('should infer the result schema of a `ChainNode`', () => {
      type Result = InferResultSchema<Node>
      expectTypeOf<Result>().toEqualTypeOf<{
        value: { name: string; type: ChainType<number> }
      }>()
    })

    it('should infer the result of a `ChainNode`', () => {
      type Result = InferResult<Node>
      expectTypeOf<Result>().toEqualTypeOf<{ value: number }>()
    })

    it('should infer the keys of the result of a `ChainNode`', () => {
      type Result = InferResultKeys<Node>
      expectTypeOf<Result>().toEqualTypeOf<'value'>()
    })

    it('should infer the value of the result of a `ChainNode`', () => {
      type Result = InferResultValue<Node, 'value'>
      expectTypeOf<Result>().toEqualTypeOf<number>()
    })
  })

  describe('data', () => {
    it('should infer the data schema of a `ChainNode`', () => {
      type Result = InferDataSchema<Node>
      expectTypeOf<Result>().toEqualTypeOf<{ text: { name: string; type: ChainType<string> } }>()
    })

    it('should infer the data of a `ChainNode`', () => {
      type Result = InferData<Node>
      expectTypeOf<Result>().toEqualTypeOf<{ text: string }>()
    })

    it('should infer the keys of the data of a `ChainNode`', () => {
      type Result = InferDataKeys<Node>
      expectTypeOf<Result>().toEqualTypeOf<'text'>()
    })

    it('should infer the value of the data of a `ChainNode`', () => {
      type Result = InferDataValue<Node, 'text'>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })
  })
}
