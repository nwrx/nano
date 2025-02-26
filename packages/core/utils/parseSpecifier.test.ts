import { ERRORS as E } from './errors'
import { parseSpecifier } from './parseSpecifier'

describe('parseSpecifier', () => {
  describe('with registry', () => {
    it('should parse a full specifier with registry, workspace, collection, name and tag', () => {
      const result = parseSpecifier('example.com:workspace/collection/component@1.0.0')
      expect(result).toStrictEqual({
        registry: 'example.com',
        workspace: 'workspace',
        collection: 'collection',
        name: 'component',
        tag: '1.0.0',
      })
    })

    it('should parse a specifier with registry, collection and name', () => {
      const result = parseSpecifier('example.com:collection/component')
      expect(result).toStrictEqual({
        registry: 'example.com',
        workspace: 'default',
        collection: 'collection',
        name: 'component',
        tag: 'latest',
      })
    })

    it('should parse a specifier with only registry and name', () => {
      const result = parseSpecifier('example.com:component')
      expect(result).toStrictEqual({
        registry: 'example.com',
        workspace: 'default',
        collection: 'default',
        name: 'component',
        tag: 'latest',
      })
    })

    it('should throw an error if the specifier is empty after registry', () => {
      const shouldThrow = () => parseSpecifier('example.com:')
      expect(shouldThrow).toThrow(E.COMPONENT_INVALID_SPECIFIER_FORMAT('example.com:'))
    })
  })

  describe('without registry', () => {
    it('should parse a specifier with workspace, collection, name and tag', () => {
      const result = parseSpecifier('workspace/collection/component@1.0.0')
      expect(result).toStrictEqual({
        registry: 'default',
        workspace: 'workspace',
        collection: 'collection',
        name: 'component',
        tag: '1.0.0',
      })
    })

    it('should parse a specifier with collection and name', () => {
      const result = parseSpecifier('collection/component')
      expect(result).toStrictEqual({
        registry: 'default',
        workspace: 'default',
        collection: 'collection',
        name: 'component',
        tag: 'latest',
      })
    })

    it('should parse a specifier with just name', () => {
      const result = parseSpecifier('component')
      expect(result).toStrictEqual({
        registry: 'default',
        workspace: 'default',
        collection: 'default',
        name: 'component',
        tag: 'latest',
      })
    })

    it('should throw an error if the specifier is empty', () => {
      const shouldThrow = () => parseSpecifier('')
      expect(shouldThrow).toThrow(E.COMPONENT_INVALID_SPECIFIER_FORMAT(''))
    })
  })
})
