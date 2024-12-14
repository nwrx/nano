import { parseComponentSpecifier } from './parseComponentSpecifier'

describe('parseComponentSpecifier', () => {
  describe('with provider name', () => {
    it('should parse a specifier with module, version, and name', () => {
      const result = parseComponentSpecifier('example.com:module@1/name')
      expect(result).toStrictEqual({
        moduleName: 'module',
        moduleVersion: '1',
        componentName: 'name',
        providerName: 'example.com',
      })
    })

    it('should parse a specifier with module and name', () => {
      const result = parseComponentSpecifier('example.com:module/name')
      expect(result).toStrictEqual({
        moduleName: 'module',
        moduleVersion: 'latest',
        componentName: 'name',
        providerName: 'example.com',
      })
    })

    it('should throw an error if the specifier is invalid', () => {
      const shouldThrow = () => parseComponentSpecifier('example.com:module')
      expect(shouldThrow).toThrow('The component specifier "example.com:module" is invalid.')
    })
  })

  describe('without provider name', () => {
    it('should parse a specifier with module, version, and name', () => {
      const result = parseComponentSpecifier('module@1/name')
      expect(result).toStrictEqual({
        moduleName: 'module',
        moduleVersion: '1',
        componentName: 'name',
        providerName: undefined,
      })
    })

    it('should parse a specifier with module and name', () => {
      const result = parseComponentSpecifier('module/name')
      expect(result).toStrictEqual({
        moduleName: 'module',
        moduleVersion: 'latest',
        componentName: 'name',
        providerName: undefined,
      })
    })

    it('should default to the core module if no module is provided', () => {
      const result = parseComponentSpecifier('name')
      expect(result).toStrictEqual({
        moduleName: 'core',
        moduleVersion: 'latest',
        componentName: 'name',
        providerName: undefined,
      })
    })
  })
})
