import { COMPONENTS } from '../components'
import { DEFAULT_COMPONENT_RESOLVER } from './defaultComponentResolver'

describe('DEFAULT_COMPONENT_RESOLVER', () => {
  const specifierObject = {
    workspace: 'default',
    collection: 'default',
    registry: 'default',
    tag: 'latest',
    name: 'example',
  }

  describe('edge cases', () => {
    it('should return undefined if the workspace is not "default"', () => {
      const specifier = { ...specifierObject, workspace: 'not-default' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })

    it('should return undefined if the collection is not "default"', () => {
      const specifier = { ...specifierObject, collection: 'not-default' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })

    it('should return undefined if the registry is not "default"', () => {
      const specifier = { ...specifierObject, registry: 'not-default' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })

    it('should return undefined if the tag is not "latest"', () => {
      const specifier = { ...specifierObject, tag: 'not-latest' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })

    it('should return undefined if the component does not exist in the components object', () => {
      const specifier = { ...specifierObject, name: 'nonexistent' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })
  })

  describe('returning the component', () => {
    it('should return the "input" component', () => {
      const specifier = { ...specifierObject, name: 'input' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBe(COMPONENTS.input)
    })

    it('should return the "output" component', () => {
      const specifier = { ...specifierObject, name: 'output' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBe(COMPONENTS.output)
    })
  })
})
