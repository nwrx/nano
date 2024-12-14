import type { Component } from './defineComponent'
import { SYMBOL_COMPONENT } from './defineComponent'

/**
 * Predicate if the given value is a `Component`. This function
 * will check each property of the value to determine if it is a valid
 * `Component`.
 *
 * @param value The value to check if it is a `Component`.
 * @returns `true` if the value is a `Component`, otherwise `false`.
 * @example isComponent({ kind: 'parse-json' })
 */
export function isComponent(value: unknown): value is Component {
  return (
    typeof value === 'object'
    && value !== null
    && '@instanceOf' in value
    && value['@instanceOf'] === SYMBOL_COMPONENT
  )
}
