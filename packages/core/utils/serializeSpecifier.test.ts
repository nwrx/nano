import { serializeSpecifier } from './serializeSpecifier'

describe('serializeSpecifier', () => {
  it('should serialize a specifier with default registry and latest tag', () => {
    const specifier = { collection: 'core', registry: 'default', tag: 'latest', name: 'example' }
    const result = serializeSpecifier(specifier)
    expect(result).toBe('core/example')
  })

  it('should serialize a specifier with default registry and non-latest tag', () => {
    const specifier = { collection: 'core', registry: 'default', tag: '1', name: 'example' }
    const result = serializeSpecifier(specifier)
    expect(result).toBe('core/example@1')
  })

  it('should serialize a specifier with non-default registry and latest tag', () => {
    const specifier = { collection: 'core', registry: 'custom', tag: 'latest', name: 'example' }
    const result = serializeSpecifier(specifier)
    expect(result).toBe('custom:core/example')
  })

  it('should serialize a specifier with non-default registry and non-latest tag', () => {
    const specifier = { collection: 'core', registry: 'custom', tag: 'v1.0.0', name: 'example' }
    const result = serializeSpecifier(specifier)
    expect(result).toBe('custom:core/example@v1.0.0')
  })
})
