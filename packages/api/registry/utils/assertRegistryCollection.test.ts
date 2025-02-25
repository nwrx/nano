import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { assertRegistryCollection } from './assertRegistryCollection'

describe('assertRegistryCollection', () => {
  describe('pass', () => {
    it('should assert a collection with required fields', () => {
      const shouldPass = () => assertRegistryCollection({
        id: randomUUID(),
        name: 'test-collection',
      })
      expect(shouldPass).not.toThrow()
    })
  })

  describe('fail', () => {
    it('should throw if id is invalid', () => {
      const shouldThrow = () => assertRegistryCollection({
        id: 'invalid-uuid',
        name: 'test-collection',
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw if name is empty', () => {
      const shouldThrow = () => assertRegistryCollection({
        id: randomUUID(),
        name: '',
      })
      expect(shouldThrow).toThrow(ValidationError)
    })
  })
})
