import { ERRORS as E } from './errors'
import { parseSpecifier } from './parseSpecifier'

describe('parseSpecifier', () => {
  describe('with provider name', () => {
    it('should parse a specifier with collection, version, and name', () => {
      const result = parseSpecifier('example.com:my-collection/my-component@1')
      expect(result).toStrictEqual({
        tag: '1',
        name: 'my-component',
        collection: 'my-collection',
        registry: 'example.com',
      })
    })

    it('should parse a specifier with collection and name', () => {
      const result = parseSpecifier('example.com:my-collection/my-component')
      expect(result).toStrictEqual({
        tag: 'latest',
        name: 'my-component',
        collection: 'my-collection',
        registry: 'example.com',
      })
    })

    it('should throw an error if the specifier is invalid', () => {
      const shouldThrow = () => parseSpecifier('example.com:my-collection')
      const error = E.COMPONENT_INVALID_SPECIFIER_FORMAT('example.com:my-collection')
      expect(shouldThrow).toThrow(error)
    })
  })

  describe('without provider name', () => {
    it('should parse a specifier with collection, version, and name', () => {
      const result = parseSpecifier('my-collection/my-component@1')
      expect(result).toStrictEqual({
        tag: '1',
        name: 'my-component',
        collection: 'my-collection',
        registry: 'default',
      })
    })

    it('should parse a specifier with collection and name', () => {
      const result = parseSpecifier('my-collection/my-component')
      expect(result).toStrictEqual({
        tag: 'latest',
        name: 'my-component',
        collection: 'my-collection',
        registry: 'default',
      })
    })

    it('should default to the core collection if no collection is provided', () => {
      const result = parseSpecifier('my-component')
      expect(result).toStrictEqual({
        tag: 'latest',
        name: 'my-component',
        collection: 'core',
        registry: 'default',
      })
    })
  })
})
