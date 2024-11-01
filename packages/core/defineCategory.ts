import { assert, createSchema, ValidationError } from '@unshared/validation'

const PARSE_CATEGORY = createSchema({

  /**
   * The internal kind of the category for identification
   * purposes. This should be unique across all categories.
   *
   * @example 'math'
   */
  kind: [
    assert.notNil.with('You must provide a kind for the category.'),
    assert.string.with('The kind of the category must be a string.'),
    assert.stringNotEmpty.with('The kind of the category must be a non-empty string.'),
    assert.stringKebabCase.with('The kind of the category must be kebab-case.'),
  ],

  /**
   * The name of the category that is displayed to the user
   * in the UI. It should be human-readable and concise.
   *
   * @example 'Math'
   */
  name: [[assert.undefined], [
    assert.string.with('The name of the category must be a string.'),
    assert.stringNotEmpty.with('The name of the category must be a non-empty string.'),
  ]],

  /**
   * An URL to an icon that represents the category in the UI.
   * The icon should be a square image with a transparent background.
   *
   * @example 'https://api.iconify.design/carbon:math.svg'
   */
  icon: [[assert.undefined], [
    assert.string.with('The icon of the category must be a string.'),
    assert.stringNotEmpty.with('The icon of the category must be a non-empty string.'),
  ]],

  /**
   * A color that is used to represent the category in the UI.
   * The color should be a hexadecimal color code.
   *
   * @example '#FF0000'
   */
  color: [[assert.undefined], [
    assert.string.with('The color of the category must be a string.'),
    assert.stringMatching(/^#[\dA-Fa-f]{6}$/).with('The color of the category must be a hexadecimal color code.'),
  ]],

  /**
   * A paragraph of text that describes the category and its
   * purpose to the user. It should be concise and informative.
   *
   * @example 'A collection of nodes for performing mathematical operations.'
   */
  description: [[assert.undefined], [
    assert.string.with('The description of the category must be a string.'),
    assert.stringNotEmpty.with('The description of the category must be a non-empty string.'),
  ]],
})

/** A category that groups nodes with a similar purpose. */
export interface Category {
  kind: string
  name?: string
  icon?: string
  color?: string
  description?: string
}

/**
 * Defines a new `Category` that groups nodes with a similar purpose.
 *
 * @param category The category to define.
 * @returns The defined category.
 * @example
 *
 * // Define a new category for math nodes.
 * const CategoryMath = defineCategory({ kind: 'math', ... })
 *
 * // Assign a node to the math category.
 * const NodeAdd = defineNode({ kind: 'add', category: 'math', ... })
 *
 * // Register the category and node in the module.
 * const module = defineModule({ nodes: [NodeAdd], categories: [CategoryMath] })
 */
export function defineCategory(category: Category): Category {
  try {
    return PARSE_CATEGORY({ ...category, name: category?.name ?? category?.kind })
  }
  catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.context as Record<string, Error | ValidationError>
      for (const key in errors) {
        if (errors[key] instanceof ValidationError) {
          if (errors[key].name === 'E_RULE_SET_MISMATCH')
            throw errors[key].context[0]
          throw errors[key]
        }
      }
    }
    throw error
  }
}
