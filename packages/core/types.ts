import type { Flow } from './createFlow'
import type { FlowModule } from './defineFlowModule'
import type { FlowNode, FlowNodePort, FlowSchema } from './defineFlowNode'
import type { FlowType } from './defineFlowType'

/**
 * Given a `Flow` instance or a `FlowModule` instance, infer the available node
 * kinds that can be added to the flow. The node kinds are inferred from the
 * `FlowModule` instances that are added to the flow.
 *
 * @template T The `FlowModule` instance to infer the node kinds from.
 */
export type InferNodeKind<T extends Flow | FlowModule> =
    T extends Flow<infer U extends FlowModule> ? InferNodeKind<U>
      : T extends FlowModule<infer U, infer N> ? `${U}:${N[keyof N]['kind']}`
        : never

/**
 * Given a `Flow` instance or a `FlowModule` instance, infer the available node
 * kinds that can be added to the flow. The node kinds are inferred from the
 * `FlowModule` instances that are added to the flow.
 *
 * @template T The `FlowModule` or `Flow` instance to infer the node kinds from.
 * @example
 *
 * // Infer the node kinds from a flow instance.
 * type NodeKind = InferNodeKind<typeof flow>
 *
 * // Infer the node kinds from a module instance.
 * type NodeKind = InferNodeKind<typeof module>
 */
export type InferNode<T extends Flow | FlowModule> =
  T extends Flow<infer U extends FlowModule> ? InferNode<U>
    : T extends FlowModule<string, infer N> ? N[keyof N]
      : never

/**
 * Given a `Flow` instance or a `FlowModule` instance and a kind, infer the node
 * that corresponds to the kind. The node is inferred from the `FlowModule`
 * instances that are added to the flow.
 *
 * @template T The `FlowModule` or `Flow` instance to infer the node from.
 * @template K The kind of the node to infer.
 * @example
 *
 * // Infer the node from a flow instance.
 * type Node = InferNode<typeof flow, 'example:parse:boolean'>
 *
 * // Infer the node from a module instance.
 * type Node = InferNode<typeof module, 'example:parse:boolean'>
 */
export type InferNodeByKind<T extends Flow | FlowModule, K extends InferNodeKind<T>> =
  K extends `${infer U}:${infer N}`

    // Infer the node from a flow module instance.
    ? T extends FlowModule<U, any, any>
      ? InferNode<T> extends infer R ? R extends { kind: N } ? R : never : never

      // Infer the node from a flow instance.
      : T extends Flow<infer M extends FlowModule<U>>
        ? K extends InferNodeKind<M> ? InferNodeByKind<M, K> : never : never

    : never

/**
 * Extract the type of the given `FlowNodePort` instance.
 *
 * @template T The `FlowNodePort` instance to extract the type from.
 * @example
 * type Port = FlowNodePort<string>
 * type PortType = InferPortType<Port> // string
 */
export type InferPortType<T extends FlowNodePort> =
  T extends FlowNodePort<infer U> ? U : never

/**
 * Infer the raw type contained in a `FlowNodeSchema` schema. The raw type is
 * the type that is parsed from the schema and used in the chain.
 *
 * @template T The schema to infer the raw type from.
 * @example
 * type Schema = { value: FlowNodePort<string>; other: FlowNodePort<number> }
 * type RawType = InferRawType<Schema> // { value: string; other: number }
 */
export type InferSchemaType<T extends FlowSchema> =
  { [K in keyof T]: InferPortType<T[K]> }

/**
 * Infer the keys of a schema. The keys are the names of the edges in the schema.
 *
 * @template T The schema to infer the keys from.
 * @example
 * type Schema = { value: { ... }; other: { ... } }
 * type Keys = InferSchemaKeys<Schema> // 'value' | 'other'
 */
export type InferSchemaKeys<T extends FlowSchema> =
  InferSchemaType<T> extends Record<infer K, any> ? K & string : never

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
export type InferSchemaValue<T extends FlowSchema, K extends InferSchemaKeys<T>> =
  InferSchemaType<T>[K]

/**
 * Given a `FlowNode` instance, infer the schema of the data that the node
 * requires. The schema is the type that is parsed from the schema and used in
 * the chain.
 *
 * @template T The `FlowNode` instance to infer the data schema from.
 * @example
 * class Node extends FlowNode {
 *   defineDataSchema() {
 *    return {
 *     value: { name: 'Value', type: TypePrimitiveString },
 *     other: { name: 'Other', type: TypePrimitiveNumber },
 *   }
 * }
 *
 * type Result = InferDataSchema<Node>
 * // {
 * //   value: { name: 'Value', type: FlowType<string> },
 * //   other: { name: 'Other', type: FlowType<number> },
 * // }
 */
export type InferDataSchema<T extends object> =
  T extends FlowNode<string, infer U, any> ? U : never

/**
 * Given a `FlowNode` instance, infer the schema of the result that the node
 * produces. The schema is the type that is parsed from the schema and used in
 * the chain.
 *
 * @template T The `FlowNode` instance to infer the result schema from.
 * @example
 * class Node extends FlowNode {
 *   defineResultSchema() {
 *    return {
 *     value: { name: 'Value', type: TypePrimitiveString },
 *     other: { name: 'Other', type: TypePrimitiveNumber },
 *   }
 * }
 *
 * type Result = InferResultSchema<Node>
 * // {
 * //   value: { name: 'Value', type: FlowType<string> },
 * //   other: { name: 'Other', type: FlowType<number> },
 * // }
 */
export type InferResultSchema<T extends object> =
  T extends FlowNode<any, any, infer U> ? U : never

/**
 * Given a `FlowNode` instance, infer the type of the result that the node
 * produces when the node is processed.
 *
 * @template T The `FlowNode` instance to infer the result from.
 * @example
 * const node = defineFlowNode({
 *   defineResultSchema: {
 *     value: { name: 'Value', type: typeString },
 *     other: { name: 'Other', type: typeNumber },
 *   }
 * })
 *
 * type Result = InferResult<typeof node> // { value: string; other: number }
 */
export type InferResult<T extends object> = InferSchemaType<InferResultSchema<T>>
export type InferResultKeys<T extends object> = keyof InferResultSchema<T> & string
export type InferResultValue<T extends object, K extends InferResultKeys<T>> = InferResult<T>[K]

/**
 * Given a `FlowNode` instance, infer the type of the data that the node expects
 * when the node is processed.
 *
 * @template T The `FlowNode` instance to infer the data from.
 * @example
 * const node = defineFlowNode({
 *   defineDataSchema: {
 *     value: { name: 'Value', type: typeString },
 *     other: { name: 'Other', type: typeNumber },
 *   }
 * })
 *
 * type Result = InferData<typeof node> // { value: string; other: number }
 */
export type InferData<T extends object> = InferSchemaType<InferDataSchema<T>>
export type InferDataKeys<T extends object> = keyof InferDataSchema<T> & string
export type InferDataValue<T extends object, K extends InferDataKeys<T>> = InferData<T>[K]

/* v8 ignore start */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
if (import.meta.vitest) {
  const { moduleExample, nodeParseBoolean, nodeParseNumber } = await import('./__fixtures__')

  describe('infer node', () => {
    it('should infer the nodes of a `Flow` instance', () => {
      type FlowInstance = Flow<typeof moduleExample>
      type Result = InferNode<FlowInstance>
      expectTypeOf<Result>().toEqualTypeOf<typeof nodeParseBoolean | typeof nodeParseNumber>()
    })

    it('should infer the node kind of a `FlowModule` instance', () => {
      type Result = InferNode<typeof moduleExample>
      expectTypeOf<Result>().toEqualTypeOf<typeof nodeParseBoolean | typeof nodeParseNumber>()
    })

    it('should infer the node kind of a `Flow` instance', () => {
      type FlowInstance = Flow<typeof moduleExample>
      type Result = InferNodeKind<FlowInstance>
      expectTypeOf<Result>().toEqualTypeOf<'example:parse-boolean' | 'example:parse-number' >()
    })

    it('should infer the node kind of a `FlowModule` instance', () => {
      type Result = InferNodeKind<typeof moduleExample>
      expectTypeOf<Result>().toEqualTypeOf<'example:parse-boolean' | 'example:parse-number' >()
    })

    it('should infer the node by kind of a `Flow` instance', () => {
      type FlowInstance = Flow<typeof moduleExample>
      type Result = InferNodeByKind<FlowInstance, 'example:parse-boolean'>
      expectTypeOf<Result>().toEqualTypeOf<typeof nodeParseBoolean>()
    })

    it('should infer the node by kind of a `FlowModule` instance', () => {
      type Result = InferNodeByKind<typeof moduleExample, 'example:parse-boolean'>
      expectTypeOf<Result>().toEqualTypeOf<typeof nodeParseBoolean>()
    })
  })

  describe('infer schema', () => {
    it('should infer the raw type of a `FlowNodePort`', () => {
      type Schema = { value: { name: 'Value'; type: FlowType<string> } }
      type Result = InferSchemaType<Schema>
      expectTypeOf<Result>().toEqualTypeOf<{ value: string }>()
    })

    it('should infer the keys of a `FlowNodeSchema`', () => {
      type Schema = { value: { name: 'Value'; type: FlowType<string> } }
      type Result = InferSchemaKeys<Schema>
      expectTypeOf<Result>().toEqualTypeOf<'value'>()
    })

    it('should infer the value type of a `FlowNodeSchema` by its key', () => {
      type Schema = { value: { name: 'Value'; type: FlowType<string> } }
      type Result = InferSchemaValue<Schema, 'value'>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })
  })

  describe('infer result', () => {
    it('should infer the result schema of a `FlowNode`', () => {
      type Result = InferResultSchema<typeof nodeParseBoolean>
      expectTypeOf<Result>().toEqualTypeOf<{ boolean: { name: string; type: FlowType<boolean>; description: string } }>()
    })

    it('should infer the result of a `FlowNode`', () => {
      type Result = InferResult<typeof nodeParseBoolean>
      expectTypeOf<Result>().toEqualTypeOf<{ boolean: boolean }>()
    })

    it('should infer the keys of the result of a `FlowNode`', () => {
      type Result = InferResultKeys<typeof nodeParseBoolean>
      expectTypeOf<Result>().toEqualTypeOf<'boolean'>()
    })

    it('should infer the value of the result of a `FlowNode`', () => {
      type Result = InferResultValue<typeof nodeParseBoolean, 'boolean'>
      expectTypeOf<Result>().toEqualTypeOf<boolean>()
    })
  })

  describe('infer data', () => {
    it('should infer the data schema of a `FlowNode`', () => {
      type Result = InferDataSchema<typeof nodeParseBoolean>
      expectTypeOf<Result>().toEqualTypeOf<{ string: { name: string; type: FlowType<string>; description: string } }>()
    })

    it('should infer the data of a `FlowNode`', () => {
      type Result = InferData<typeof nodeParseBoolean>
      expectTypeOf<Result>().toEqualTypeOf<{ string: string }>()
    })

    it('should infer the keys of the data of a `FlowNode`', () => {
      type Result = InferDataKeys<typeof nodeParseBoolean>
      expectTypeOf<Result>().toEqualTypeOf<'string'>()
    })

    it('should infer the value of the data of a `FlowNode`', () => {
      type Result = InferDataValue<typeof nodeParseBoolean, 'string'>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })
  })
}
