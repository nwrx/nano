import type { Module } from './defineModule'
import type { Node } from './defineNode'
import type { SocketType } from './defineSocketType'
import { nodeInput, nodeJsonParse, typeBoolean, typeNumber, typeString } from './__fixtures__'
import { defineModule } from './defineModule'

describe('defineFlowModule', () => {
  describe('defineFlowModule', () => {
    it('should define a flow module with the given options', () => {
      const module = defineModule({
        kind: 'microsoft-azure',
        name: 'Microsoft Azure',
        icon: 'https://api.iconify.design/carbon:cloud.svg',
        description: 'A collection of nodes for working with Microsoft Azure services.',
        nodes: [nodeJsonParse, nodeInput],
        types: [typeBoolean, typeNumber, typeString],
      })
      expect(module).toStrictEqual({
        kind: 'microsoft-azure',
        name: 'Microsoft Azure',
        icon: 'https://api.iconify.design/carbon:cloud.svg',
        description: 'A collection of nodes for working with Microsoft Azure services.',
        nodes: [nodeJsonParse, nodeInput],
        types: [typeBoolean, typeNumber, typeString],
      })
    })

    it('should define a flow module with minimal options', () => {
      const module = defineModule({ kind: 'microsoft-azure' })
      expect(module).toStrictEqual({
        kind: 'microsoft-azure',
        name: 'microsoft-azure',
        icon: undefined,
        description: undefined,
        nodes: [],
        types: [],
      })
    })

    it('should not return the same object', () => {
      const object = { kind: 'microsoft-azure' }
      const module = defineModule(object)
      expect(module).not.toBe(object)
    })
  })

  describe('edge cases', () => {
    it('should throw an error if options is undefined', () => {
      // @ts-expect-error: test invalid input
      const shouldThrow = () => defineModule()
      expect(shouldThrow).toThrow('Expected value not to be null or undefined')
    })

    it('should throw an error if the kind is undefined', () => {
    // @ts-expect-error: test invalid input
      const shouldThrow = () => defineModule({ kind: undefined })
      expect(shouldThrow).toThrow('Expected value to be a string but received: undefined')
    })

    it('should throw an error if the kind is null', () => {
    // @ts-expect-error: test invalid input
    // eslint-disable-next-line unicorn/no-null
      const shouldThrow = () => defineModule({ kind: null })
      expect(shouldThrow).toThrow('Expected value to be a string but received: null')
    })

    it('should throw an error if the kind is an empty string', () => {
      const shouldThrow = () => defineModule({ kind: '' })
      expect(shouldThrow).toThrow('Expected value to be a non-empty string but received an empty string')
    })

    it('should throw an error if the kind is not a string', () => {
    // @ts-expect-error: test invalid input
      const shouldThrow = () => defineModule({ kind: 123 })
      expect(shouldThrow).toThrow('Expected value to be a string but received: number')
    })
  })

  describe('type inference', () => {
    it('should infer the type of the flow module', () => {
      const module = defineModule({
        kind: 'microsoft-azure',
        name: 'Microsoft Azure',
        icon: 'https://api.iconify.design/carbon:cloud.svg',
        description: 'A collection of nodes for working with Microsoft Azure services.',
        nodes: [nodeJsonParse, nodeInput],
        types: [typeBoolean, typeNumber, typeString],
      })

      expectTypeOf(module).toMatchTypeOf<
        Module<
          'microsoft-azure',
          Node<'input' | 'parse-json', any, any>,
          SocketType<boolean | number | string>
        >
      >()
    })
  })
})
