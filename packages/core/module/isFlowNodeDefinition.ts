import type { FlowNodeDefinition } from './defineNode'

/**
 * Predicate if the given value is a `FlowNodeDefinition`. This function
 * will check each property of the value to determine if it is a valid
 * `FlowNodeDefinition`.
 *
 * @param value The value to check if it is a `FlowNodeDefinition`.
 * @returns `true` if the value is a `FlowNodeDefinition`, otherwise `false`.
 * @example isFlowNodeDefinition({ kind: 'parse-json' })
 */

export function isFlowNodeDefinition(value: unknown): value is FlowNodeDefinition {
  return (
    typeof value === 'object'
    && value !== null
    && 'kind' in value
    && typeof value.kind === 'string'
  )
}
