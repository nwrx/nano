import { AssertionError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { assertMcpManager } from './assertMcpManager'

describe('assertMcpManager', () => {
  const id = randomUUID()
  const address = 'manager.mcp.example.com'
  const identity = 'manager-eu-west-1-1'

  describe('pass', () => {
    it('should assert a valid manager', () => {
      const shouldPass = () => assertMcpManager({ id, address, identity })
      expect(shouldPass).not.toThrow()
    })
  })

  describe('fail', () => {
    describe('id', () => {
      it('should throw if id is not a valid UUID', () => {
        const shouldFail = () => assertMcpManager({ id: 'invalid-uuid', address, identity })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if id is missing', () => {
        const shouldFail = () => assertMcpManager({ address, identity })
        expect(shouldFail).toThrow(AssertionError)
      })
    })

    describe('address', () => {
      it('should throw if address is not a non-empty string', () => {
        const shouldFail = () => assertMcpManager({ id, address: '', identity })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if address is missing', () => {
        const shouldFail = () => assertMcpManager({ id, identity })
        expect(shouldFail).toThrow(AssertionError)
      })
    })

    describe('identity', () => {
      it('should throw if identity is not a non-empty string', () => {
        const shouldFail = () => assertMcpManager({ id, address, identity: '' })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if identity is missing', () => {
        const shouldFail = () => assertMcpManager({ id, address })
        expect(shouldFail).toThrow(AssertionError)
      })
    })
  })
})
