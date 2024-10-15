import type { Flow } from './createFlow'
import type { Module } from './defineModule'

export type ObjectLike = Record<string, unknown>
export type MaybePromise<T> = Promise<T> | T

/**
 * Given a `Flow` instance or a `Module` instance, infer the available node
 * kinds that can be added to the flow. The node kinds are inferred from the
 * `Module` instances that are added to the flow.
 *
 * @template T The `Module` instance to infer the node kinds from.
 */
export type NodeKind<T extends Flow | Module> =
    T extends Flow<infer U extends Module> ? NodeKind<U>
      : T extends Module<infer U, infer N> ? `${U}:${N['kind']}`
        : never

/**
 * Given a `Flow` instance or a `Module` instance, infer the available node
 * kinds that can be added to the flow. The node kinds are inferred from the
 * `Module` instances that are added to the flow.
 *
 * @template T The `Module` or `Flow` instance to infer the node kinds from.
 * @example
 *
 * // Infer the node kinds from a flow instance.
 * type NodeKind = InferNodeKind<typeof flow>
 *
 * // Infer the node kinds from a module instance.
 * type NodeKind = InferNodeKind<typeof module>
 */
export type NodeOf<T extends Flow | Module> =
  T extends Flow<infer U extends Module> ? NodeOf<U>
    : T extends Module<string, infer N> ? N
      : never

/**
 * Given a `Flow` instance or a `Module` instance and a kind, infer the node
 * that corresponds to the kind. The node is inferred from the `Module`
 * instances that are added to the flow.
 *
 * @template T The `Module` or `Flow` instance to infer the node from.
 * @template K The kind of the node to infer.
 * @example
 *
 * // Infer the node from a flow instance.
 * type Node = InferNode<typeof flow, 'example:parse:boolean'>
 *
 * // Infer the node from a module instance.
 * type Node = InferNode<typeof module, 'example:parse:boolean'>
 */
export type NodeByKind<T extends Flow | Module, K extends NodeKind<T>> =
  K extends `${infer U}:${infer N}`

    // Infer the node from a flow module instance.
    ? T extends Module<U, any, any>
      ? NodeOf<T> extends infer R ? R extends { kind: N } ? R : never : never

      // Infer the node from a flow instance.
      : T extends Flow<infer M extends Module<U>>
        ? K extends NodeKind<M> ? NodeByKind<M, K> : never : never

    : never
