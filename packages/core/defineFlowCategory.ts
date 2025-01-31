import { assertNotNil, assertStringNotEmpty } from '@unshared/validation'

/**
 * A `FlowCategory` defines a collection of node that have a common purpose.
 */
export interface FlowCategory {

  /**
   * The internal kind of the category for identification
   * purposes. This should be unique across all categories.
   *
   * @example 'math'
   */
  kind: string

  /**
   * The name of the category that is displayed to the user
   * in the UI. It should be human-readable and concise.
   *
   * @example 'Math'
   */
  name?: string

  /**
   * An URL to an icon that represents the category in the UI.
   * The icon should be a square image with a transparent background.
   *
   * @example 'https://api.iconify.design/carbon:math.svg'
   */
  icon?: string

  /**
   * A color that is used to represent the category in the UI.
   * The color should be a hexadecimal color code.
   *
   * @example '#FF0000'
   */
  color?: string

  /**
   * A paragraph of text that describes the category and its
   * purpose to the user. It should be concise and informative.
   *
   * @example 'A collection of nodes for performing mathematical operations.'
   */
  description?: string
}

/**
 * Defines a new `FlowCategory` with the specified properties.
 *
 * @param category The properties of the category.
 * @returns The defined category.
 */
export function defineFlowCategory(category: FlowCategory): FlowCategory {
  assertNotNil(category)
  assertStringNotEmpty(category.kind)
  return {
    kind: category.kind,
    name: category.name,
    icon: category.icon,
    color: category.color,
    description: category.description,
  }
}
