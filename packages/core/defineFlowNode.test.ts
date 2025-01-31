import type { FlowNode } from './defineFlowNode'
import type { FlowType } from './defineFlowType'
import { categoryBasic, typeBoolean } from './__fixtures__'
import { defineFlowNode } from './defineFlowNode'

describe('defineFlowNode', () => {
  const defineDataSchema = vi.fn()
  const defineResultSchema = vi.fn()
  const process = vi.fn()

  describe('defineFlowNode', () => {
    it('should define a flow node with the given options', () => {
      const node = defineFlowNode({
        kind: 'node',
        name: 'Node',
        icon: 'https://api.iconify.design/carbon:json.svg',
        description: 'Parses JSON data into a JavaScript object.',
        category: categoryBasic,
        defineDataSchema,
        defineResultSchema,
        process,
      })

      expect(node).toStrictEqual({
        kind: 'node',
        name: 'Node',
        icon: 'https://api.iconify.design/carbon:json.svg',
        description: 'Parses JSON data into a JavaScript object.',
        category: categoryBasic,
        defineDataSchema,
        defineResultSchema,
        process,
      })
    })

    it('should define a flow node with minimal options', () => {
      const node = defineFlowNode({ kind: 'node' })
      expect(node).toStrictEqual({
        kind: 'node',
        name: 'node',
        icon: undefined,
        description: undefined,
        category: undefined,
        defineDataSchema: {},
        defineResultSchema: {},
        process: undefined,
      })
    })

    it('should not return the same object', () => {
      const object = { kind: 'node' }
      const node = defineFlowNode(object)
      expect(node).not.toBe(object)
    })
  })

  describe('edge cases', () => {
    it('should throw an error if options is undefined', () => {
    // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowNode()
      expect(shouldThrow).toThrow('Expected value not to be null or undefined')
    })

    it('should throw an error if the kind is undefined', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowNode({ kind: undefined })
      expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
    })

    it('should throw an error if the kind is null', () => {
      // @ts-expect-error: test invalid input
      // eslint-disable-next-line unicorn/no-null
      const shouldThrow = () => defineFlowNode({ kind: null })
      expect(shouldThrow).toThrow('Expected value to be a string but received: null')
    })

    it('should throw an error if the kind is an empty string', () => {
      const shouldThrow = () => defineFlowNode({ kind: '' })
      expect(shouldThrow).toThrow('Expected value to be a non-empty string but received an empty string')
    })

    it('should throw an error if the kind is not a string', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowNode({ kind: 123 })
      expect(shouldThrow).toThrow('Expected value to be a string but received: number')
    })
  })

  describe('type inference', () => {
    it('should return the type of a flow node', () => {
      const node = defineFlowNode({
        kind: 'node',
        defineDataSchema: { data: { name: 'Data', type: typeBoolean } },
        defineResultSchema: { result: { name: 'Result', type: typeBoolean } },
        process,
      })
      expectTypeOf(node).toEqualTypeOf<FlowNode<
        'node',
        { data: { name: string; type: FlowType<boolean> } },
        { result: { name: string; type: FlowType<boolean> } }
      >>()
    })
  })
})
