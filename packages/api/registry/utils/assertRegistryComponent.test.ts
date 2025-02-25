import { ValidationError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { assertRegistryComponent } from './assertRegistryComponent'

const VALID_COLLECTION = {
  id: randomUUID(),
  name: 'test-collection',
}

const VALID_CATEGORY = {
  id: randomUUID(),
  name: 'test-category',
  type: 'Purpose',
}

describe('assertRegistryComponent', () => {
  describe('pass', () => {
    it('should assert a component with required fields', () => {
      const shouldPass = () => assertRegistryComponent({
        id: randomUUID(),
        name: 'test-component',
        collection: VALID_COLLECTION,
        categories: [VALID_CATEGORY],
      })
      expect(shouldPass).not.toThrow()
    })

    it('should assert a component with empty categories', () => {
      const shouldPass = () => assertRegistryComponent({
        id: randomUUID(),
        name: 'test-component',
        collection: VALID_COLLECTION,
        categories: [],
      })
      expect(shouldPass).not.toThrow()
    })
  })

  describe('fail', () => {
    it('should throw if id is invalid', () => {
      const shouldThrow = () => assertRegistryComponent({
        id: 'invalid-uuid',
        name: 'test-component',
        collection: VALID_COLLECTION,
        categories: [],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw if name is empty', () => {
      const shouldThrow = () => assertRegistryComponent({
        id: randomUUID(),
        name: '',
        collection: VALID_COLLECTION,
        categories: [],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw if collection is invalid', () => {
      const shouldThrow = () => assertRegistryComponent({
        id: randomUUID(),
        name: 'test-component',
        collection: { id: 'invalid-uuid', name: 'test' },
        categories: [],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })

    it('should throw if categories contains invalid category', () => {
      const shouldThrow = () => assertRegistryComponent({
        id: randomUUID(),
        name: 'test-component',
        collection: VALID_COLLECTION,
        categories: [{ id: 'invalid-uuid', name: 'test' }],
      })
      expect(shouldThrow).toThrow(ValidationError)
    })
  })
})
