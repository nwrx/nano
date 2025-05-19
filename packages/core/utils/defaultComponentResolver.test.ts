import { COMPONENTS } from '../components'
import { DEFAULT_COMPONENT_RESOLVER } from './defaultComponentResolver'

describe('DEFAULT_COMPONENT_RESOLVER', () => {
  describe('edge cases', () => {
    it('should return undefined if the workspace is not "default"', () => {
      const specifier = { workspace: 'not-default', collection: 'default', registry: 'default', tag: 'latest', name: 'example' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })

    it('should return undefined if the collection is not "default"', () => {
      const specifier = { workspace: 'default', collection: 'not-default', registry: 'default', tag: 'latest', name: 'input' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })

    it('should return undefined if the registry is not "default"', () => {
      const specifier = { workspace: 'default', collection: 'default', registry: 'not-default', tag: 'latest', name: 'example' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })

    it('should return undefined if the tag is not "latest"', () => {
      const specifier = { workspace: 'default', collection: 'default', registry: 'default', tag: 'not-latest', name: 'example' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })

    it('should return undefined if the component does not exist in the components object', () => {
      const specifier = { workspace: 'default', collection: 'default', registry: 'default', tag: 'latest', name: 'nonexistent' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })
  })

  describe('returning the component', () => {
    it('should return the "input" component', () => {
      const specifier = { workspace: 'default', collection: 'default', registry: 'default', tag: 'latest', name: 'input' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBe(COMPONENTS.input)
    })

    it('should return the "output" component', () => {
      const specifier = { workspace: 'default', collection: 'default', registry: 'default', tag: 'latest', name: 'output' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBe(COMPONENTS.output)
    })
  })
})
