import type { Flow } from './createFlow'
import type { DataSchema, DataSocket } from './defineDataSocket'
import type { Module } from './defineModule'
import type { Node } from './defineNode'
import type { ResultSchema, ResultSocket } from './defineResultSocket'

export type MaybePromise<T> = Promise<T> | T

/**
 * A schema that is either a data schema or a result schema. The schema contains
 * the ports of a flow and allows the definition of the label as well as the type
 * of the socket that is used in the flow.
 */
export type FlowNodeSchema = DataSchema | ResultSchema

/**
 * Given a `Flow` instance or a `FlowModule` instance, infer the available node
 * kinds that can be added to the flow. The node kinds are inferred from the
 * `FlowModule` instances that are added to the flow.
 *
 * @template T The `FlowModule` instance to infer the node kinds from.
 */
export type InferNodeKind<T extends Flow | Module> =
    T extends Flow<infer U extends Module> ? InferNodeKind<U>
      : T extends Module<infer U, infer N> ? `${U}:${N['kind']}`
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
export type InferNode<T extends Flow | Module> =
  T extends Flow<infer U extends Module> ? InferNode<U>
    : T extends Module<string, infer N> ? N
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
export type InferNodeByKind<T extends Flow | Module, K extends InferNodeKind<T>> =
  K extends `${infer U}:${infer N}`

    // Infer the node from a flow module instance.
    ? T extends Module<U, any, any>
      ? InferNode<T> extends infer R ? R extends { kind: N } ? R : never : never

      // Infer the node from a flow instance.
      : T extends Flow<infer M extends Module<U>>
        ? K extends InferNodeKind<M> ? InferNodeByKind<M, K> : never : never

    : never

/**
 * Extract the type of the given `FlowNodePort` instance.
 *
 * @template T The `FlowNodePort` instance to extract the type from.
 * @example
 * type Port = DataSocket<string>
 * type PortType = InferSocketType<Port> // string
 */
export type InferSocketType<T extends DataSocket | ResultSocket> =
  T extends DataSocket<infer U> ? U
    : T extends ResultSocket<infer U> ? U
      : never

/**
 * Infer the raw type contained in a `FlowNodeSchema` schema. The raw type is
 * the type that is parsed from the schema and used in the chain.
 *
 * @template T The schema to infer the raw type from.
 * @example
 * type Schema = { value: FlowNodePort<string>; other: FlowNodePort<number> }
 * type RawType = InferRawType<Schema> // { value: string; other: number }
 */
export type InferSchemaType<T extends FlowNodeSchema> =
  { [K in keyof T]: InferSocketType<T[K]> }

/**
 * Infer the keys of a schema. The keys are the names of the edges in the schema.
 *
 * @template T The schema to infer the keys from.
 * @example
 * type Schema = { value: { ... }; other: { ... } }
 * type Keys = InferSchemaKeys<Schema> // 'value' | 'other'
 */
export type InferSchemaKeys<T extends FlowNodeSchema> =
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
export type InferSchemaValue<T extends FlowNodeSchema, K extends InferSchemaKeys<T>> =
  InferSchemaType<T>[K]

/**
 * Given a `Node` instance, infer the schema of the data that the node
 * requires. The schema is the type that is parsed from the schema and used in
 * the chain.
 *
 * @template T The `Node` instance to infer the data schema from.
 * @example
 * class Node extends Node {
 *   defineDataSchema() {
 *    return {
 *     value: { name: 'Value', type: TypePrimitiveString },
 *     other: { name: 'Other', type: TypePrimitiveNumber },
 *   }
 * }
 *
 * type Result = InferDataSchema<Node>
 * // {
 * //   value: { name: 'Value', type: SocketType<string> },
 * //   other: { name: 'Other', type: SocketType<number> },
 * // }
 */
export type InferDataSchema<T extends Node> =
  T extends Node<string, infer U extends DataSchema, any> ? U : never

/**
 * Given a `Node` instance, infer the schema of the result that the node
 * produces. The schema is the type that is parsed from the schema and used in
 * the chain.
 *
 * @template T The `Node` instance to infer the result schema from.
 * @example
 * class Node extends Node {
 *   defineResultSchema() {
 *    return {
 *     value: { name: 'Value', type: TypePrimitiveString },
 *     other: { name: 'Other', type: TypePrimitiveNumber },
 *   }
 * }
 *
 * type Result = InferResultSchema<Node>
 * // {
 * //   value: { name: 'Value', type: SocketType<string> },
 * //   other: { name: 'Other', type: SocketType<number> },
 * // }
 */
export type InferResultSchema<T extends Node> =
  T extends Node<any, any, infer U extends ResultSchema> ? U : never

/**
 * Given a `Node` instance, infer the type of the result that the node
 * produces when the node is processed.
 *
 * @template T The `Node` instance to infer the result from.
 * @example
 * const node = defineNode({
 *   defineResultSchema: {
 *     value: { name: 'Value', type: typeString },
 *     other: { name: 'Other', type: typeNumber },
 *   }
 * })
 *
 * type Result = InferResult<typeof node> // { value: string; other: number }
 */
export type InferResult<T extends Node> = InferSchemaType<InferResultSchema<T>>
export type InferResultKeys<T extends Node> = keyof InferResultSchema<T> & string
export type InferResultValue<T extends Node, K extends InferResultKeys<T>> = InferResult<T>[K]

/**
 * Given a `Node` instance, infer the type of the data that the node expects
 * when the node is processed.
 *
 * @template T The `Node` instance to infer the data from.
 * @example
 * const node = defineNode({
 *   defineDataSchema: {
 *     value: { name: 'Value', type: typeString },
 *     other: { name: 'Other', type: typeNumber },
 *   }
 * })
 *
 * type Result = InferData<typeof node> // { value: string; other: number }
 */
export type InferData<T extends Node> = InferSchemaType<InferDataSchema<T>>
export type InferDataKeys<T extends Node> = keyof InferDataSchema<T> & string
export type InferDataValue<T extends Node, K extends InferDataKeys<T>> = InferData<T>[K]
