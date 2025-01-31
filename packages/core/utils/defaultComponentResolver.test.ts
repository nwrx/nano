import * as COMPONENTS from '../components'
import { DEFAULT_COMPONENT_RESOLVER } from './defaultComponentResolver'

describe('DEFAULT_COMPONENT_RESOLVER', () => {
  describe('edge cases', () => {
    it('should return undefined if the collection is not "core"', () => {
      const specifier = { collection: 'not-core', registry: 'default', tag: 'latest', name: 'input' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })

    it('should return undefined if the registry is not "default"', () => {
      const specifier = { collection: 'core', registry: 'not-default', tag: 'latest', name: 'example' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })

    it('should return undefined if the tag is not "latest"', () => {
      const specifier = { collection: 'core', registry: 'default', tag: 'not-latest', name: 'example' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })

    it('should return undefined if the component does not exist in the components object', () => {
      const specifier = { collection: 'core', registry: 'default', tag: 'latest', name: 'nonexistent' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBeUndefined()
    })
  })

  describe('returning the component', () => {
    it('should return the "input" component', () => {
      const specifier = { collection: 'core', registry: 'default', tag: 'latest', name: 'input' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBe(COMPONENTS.input)
    })

    it('should return the "output" component', () => {
      const specifier = { collection: 'core', registry: 'default', tag: 'latest', name: 'output' }
      const result = DEFAULT_COMPONENT_RESOLVER(specifier)
      expect(result).toBe(COMPONENTS.output)
    })
  })
})
