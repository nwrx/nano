import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { assertRegistryCategory } from './assertRegistryCategory'

describe('assertRegistryCategory', () => {
  describe('pass', () => {
    it('should assert a category with required fields', () => {
      const shouldPass = () => assertRegistryCategory({
        id: randomUUID(),
        name: 'test-category',
        type: 'Purpose',
      })
      expect(shouldPass).not.toThrow()
    })
  })

  describe('fail', () => {
    it('should throw if id is invalid', () => {
      const shouldThrow = () => assertRegistryCategory({
        id: 'invalid-uuid',
        name: 'test-category',
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw if name is empty', () => {
      const shouldThrow = () => assertRegistryCategory({
        id: randomUUID(),
        name: '',
      })
      expect(shouldThrow).toThrow(ValidationError)
    })
  })
})
