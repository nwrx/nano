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

/* v8 ignore start */
if (import.meta.vitest) {
  describe('defineFlowCategory', () => {
    it('should define a flow category with the given options', () => {
      const category = defineFlowCategory({
        kind: 'math',
        name: 'Math',
        icon: 'https://api.iconify.design/carbon:math.svg',
        color: '#FF0000',
        description: 'A collection of nodes for performing mathematical operations.',
      })

      expect(category).toStrictEqual({
        kind: 'math',
        name: 'Math',
        icon: 'https://api.iconify.design/carbon:math.svg',
        color: '#FF0000',
        description: 'A collection of nodes for performing mathematical operations.',
      })
    })

    it('should define a flow category with minimal options', () => {
      const category = defineFlowCategory({ kind: 'math' })
      expect(category).toStrictEqual({
        kind: 'math',
        name: undefined,
        icon: undefined,
        color: undefined,
        description: undefined,
      })
    })

    it('should not return the same object', () => {
      const object = { kind: 'math' }
      const category = defineFlowCategory(object)
      expect(category).not.toBe(object)
    })
  })

  describe('error cases', () => {
    it('should throw an error if options is undefined', () => {
    // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowCategory()
      expect(shouldThrow).toThrow('Expected value not to be null or undefined')
    })

    it('should throw an error if the kind is undefined', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowCategory({ kind: undefined })
      expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
    })

    it('should throw an error if the kind is null', () => {
      // @ts-expect-error: test invalid input
      // eslint-disable-next-line unicorn/no-null
      const shouldThrow = () => defineFlowCategory({ kind: null })
      expect(shouldThrow).toThrow('Expected value to be a string but received: null')
    })

    it('should throw an error if the kind is an empty string', () => {
      const shouldThrow = () => defineFlowCategory({ kind: '' })
      expect(shouldThrow).toThrow('Expected value to be a non-empty string but received an empty string')
    })

    it('should throw an error if the kind is not a string', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowCategory({ kind: 123 })
      expect(shouldThrow).toThrow('Expected value to be a string but received: number')
    })
  })

  describe('type inference', () => {
    it('should return the type of a flow category', () => {
      const category = defineFlowCategory({ kind: 'math' })
      expectTypeOf(category).toEqualTypeOf<FlowCategory>()
    })
  })
}
