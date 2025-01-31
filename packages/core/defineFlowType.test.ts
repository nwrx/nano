/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FlowType, InferType } from './defineFlowType'
import { defineFlowType } from './defineFlowType'

describe('defineFlowType', () => {
  describe('defineFlowType', () => {
    it('should define a flow type with the given options', () => {
      const parse = vi.fn()
      const type = defineFlowType({
        kind: 'type-id',
        name: 'String',
        color: '#ff0000',
        parse,
        description: 'The string type.',
        defaultValue: 'Hello, World!',
      })

      expect(type).toStrictEqual({
        kind: 'type-id',
        name: 'String',
        color: '#ff0000',
        parse,
        description: 'The string type.',
        defaultValue: 'Hello, World!',
      })
    })

    it('should define a flow type with minimal options', () => {
      const parse = vi.fn()
      const type = defineFlowType({ kind: 'type-id', parse })

      expect(type).toStrictEqual({
        kind: 'type-id',
        name: 'type-id',
        color: undefined,
        parse,
        description: undefined,
        defaultValue: undefined,
      })
    })

    it('should not return the same object', () => {
      const object = { kind: 'type-id', parse: vi.fn() }
      const type = defineFlowType(object)
      expect(type).not.toBe(object)
    })
  })

  describe('error cases', () => {
    it('should throw an error if options is undefined', () => {
    // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowType()
      expect(shouldThrow).toThrow('Expected value not to be null or undefined')
    })

    it('should throw an error if the kind is undefined', () => {
    // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowType({ kind: undefined })
      expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
    })

    it('should throw an error if the kind is null', () => {
    // @ts-expect-error: test invalid input
    // eslint-disable-next-line unicorn/no-null
      const shouldThrow = () => defineFlowType({ kind: null })
      expect(shouldThrow).toThrow('Expected value to be a string but received: null')
    })

    it('should throw an error if the kind is an empty string', () => {
    // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowType({ kind: '' })
      expect(shouldThrow).toThrow('Expected value to be a non-empty string but received an empty string')
    })

    it('should throw an error if the kind is not a string', () => {
    // @ts-expect-error: test invalid input
      const shouldThrow = () => defineFlowType({ kind: 123 })
      expect(shouldThrow).toThrow('Expected value to be a string but received: number')
    })
  })

  describe('type inference', () => {
    it('should return the type of a flow type', () => {
      const type = defineFlowType({ kind: 'type-id', parse: (): string => '' })
      expectTypeOf<InferType<typeof type>>().toEqualTypeOf<string>()
    })

    it('should infer the type of a flow type', () => {
      type Type = FlowType<string>
      type Result = InferType<Type>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })
  })
})
