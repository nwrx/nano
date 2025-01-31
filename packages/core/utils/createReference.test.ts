import type { Reference, ReferenceFile, ReferenceNode, ReferenceSecret, ReferenceVariable } from './createReference'
import { createReference, isReference, isReferenceFile, isReferenceLink, isReferenceSecret, isReferenceVariable } from './createReference'

describe('createReference', () => {
  describe('createReference', () => {
    it('should create a reference to a file', () => {
      const result = createReference('fromFile', { path: '/path/to/file', defaultValue: 'default' })
      expect(result).toStrictEqual({ $fromFile: { path: '/path/to/file', defaultValue: 'default' } })
      expectTypeOf(result).toEqualTypeOf<ReferenceFile>()
    })

    it('should create a reference to a node', () => {
      const result = createReference('fromNode', { id: 'node-id', name: 'NodeName', path: 'value' })
      expect(result).toStrictEqual({ $fromNode: { id: 'node-id', name: 'NodeName', path: 'value' } })
      expectTypeOf(result).toEqualTypeOf<ReferenceNode>()
    })

    it('should create a reference to a variable', () => {
      const result = createReference('fromVariable', { name: 'VAR_NAME', defaultValue: 'default' })
      expect(result).toStrictEqual({ $fromVariable: { name: 'VAR_NAME', defaultValue: 'default' } })
      expectTypeOf(result).toEqualTypeOf<ReferenceVariable>()
    })

    it('should create a reference to a secret', () => {
      const result = createReference('fromSecret', { name: 'SECRET_NAME', defaultValue: 'default' })
      expect(result).toStrictEqual({ $fromSecret: { name: 'SECRET_NAME', defaultValue: 'default' } })
      expectTypeOf(result).toEqualTypeOf<ReferenceSecret>()
    })
  })

  describe('isReference', () => {
    it('should identify a file reference', () => {
      const ref = { $fromFile: { path: '/path/to/file', defaultValue: 'default' } } as unknown
      const result = isReference(ref)
      expect(result).toBe(true)
      if (result) expectTypeOf(ref).toEqualTypeOf<Reference>()
    })

    it('should identify a file reference as file', () => {
      const ref = { $fromFile: { path: '/path/to/file', defaultValue: 'default' } } as unknown
      const result = isReferenceFile(ref)
      expect(result).toBe(true)
      if (result) expectTypeOf(ref).toEqualTypeOf<ReferenceFile>()
    })

    it('should identify a node reference', () => {
      const ref = { $fromNode: { id: 'node-id', name: 'NodeName', path: 'value' } } as unknown
      const result = isReference(ref)
      expect(result).toBe(true)
      if (result) expectTypeOf(ref).toEqualTypeOf<Reference>()
    })

    it('should identify a node reference as link', () => {
      const ref = { $fromNode: { id: 'node-id', name: 'NodeName', path: 'value' } } as unknown
      const result = isReferenceLink(ref)
      expect(result).toBe(true)
      if (result) expectTypeOf(ref).toEqualTypeOf<ReferenceNode>()
    })

    it('should identify a variable reference', () => {
      const ref = { $fromVariable: { name: 'VAR_NAME', defaultValue: 'default' } } as unknown
      const result = isReference(ref)
      expect(result).toBe(true)
      if (result) expectTypeOf(ref).toEqualTypeOf<Reference>()
    })

    it('should identify a variable reference as variable', () => {
      const ref = { $fromVariable: { name: 'VAR_NAME', defaultValue: 'default' } } as unknown
      const result = isReferenceVariable(ref)
      expect(result).toBe(true)
      if (result) expectTypeOf(ref).toEqualTypeOf<ReferenceVariable>()
    })

    it('should identify a secret reference', () => {
      const ref = { $fromSecret: { name: 'SECRET_NAME', defaultValue: 'default' } } as unknown
      const result = isReference(ref)
      expect(result).toBe(true)
      if (result) expectTypeOf(ref).toEqualTypeOf<Reference>()
    })

    it('should identify a secret reference as secret', () => {
      const ref = { $fromSecret: { name: 'SECRET_NAME', defaultValue: 'default' } } as unknown
      const result = isReferenceSecret(ref)
      expect(result).toBe(true)
      if (result) expectTypeOf(ref).toEqualTypeOf<ReferenceSecret>()
    })

    it('should not identify an invalid reference', () => {
      const result = { invalid: 'invalid' }
      expect(isReference(result)).toBe(false)
    })
  })
})
