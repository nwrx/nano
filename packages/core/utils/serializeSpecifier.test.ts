import { serializeSpecifier } from './serializeSpecifier'

describe('serializeSpecifier', () => {
  describe('with all fields', () => {
    it('should serialize a specifier with all fields', () => {
      const result = serializeSpecifier({
        registry: 'example.com',
        workspace: 'workspace',
        collection: 'collection',
        name: 'component',
        tag: '1.0.0',
      })
      expect(result).toBe('example.com:workspace/collection/component@1.0.0')
    })
  })

  describe('with one default field', () => {
    it('should serialize a specifier with default registry', () => {
      const result = serializeSpecifier({
        registry: 'default',
        workspace: 'workspace',
        collection: 'collection',
        name: 'component',
        tag: '1.0.0',
      })
      expect(result).toBe('workspace/collection/component@1.0.0')
    })

    it('should serialize a specifier with default workspace', () => {
      const result = serializeSpecifier({
        registry: 'example.com',
        workspace: 'default',
        collection: 'collection',
        name: 'component',
        tag: '1.0.0',
      })
      expect(result).toBe('example.com:collection/component@1.0.0')
    })

    it('should serialize a specifier with default tag', () => {
      const result = serializeSpecifier({
        registry: 'example.com',
        workspace: 'workspace',
        collection: 'collection',
        name: 'component',
        tag: 'latest',
      })
      expect(result).toBe('example.com:workspace/collection/component')
    })

    it('should serialize a specifier with default collection', () => {
      const result = serializeSpecifier({
        registry: 'example.com',
        workspace: 'workspace',
        collection: 'default',
        name: 'component',
        tag: '1.0.0',
      })
      expect(result).toBe('example.com:workspace/default/component@1.0.0')
    })
  })

  describe('with two default fields', () => {
    it('should serialize a specifier with default registry and workspace', () => {
      const result = serializeSpecifier({
        registry: 'default',
        workspace: 'default',
        collection: 'collection',
        name: 'component',
        tag: '1.0.0',
      })
      expect(result).toBe('collection/component@1.0.0')
    })

    it('should serialize a specifier with default registry and tag', () => {
      const result = serializeSpecifier({
        registry: 'default',
        workspace: 'workspace',
        collection: 'collection',
        name: 'component',
        tag: 'latest',
      })
      expect(result).toBe('workspace/collection/component')
    })

    it('should serialize a specifier with default workspace and tag', () => {
      const result = serializeSpecifier({
        registry: 'example.com',
        workspace: 'default',
        collection: 'collection',
        name: 'component',
        tag: 'latest',
      })
      expect(result).toBe('example.com:collection/component')
    })

    it('should serialize a specifier with default collection and tag', () => {
      const result = serializeSpecifier({
        registry: 'example.com',
        workspace: 'workspace',
        collection: 'default',
        name: 'component',
        tag: 'latest',
      })
      expect(result).toBe('example.com:workspace/default/component')
    })
  })
})
