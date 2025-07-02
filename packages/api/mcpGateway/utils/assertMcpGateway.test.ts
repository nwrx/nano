import { AssertionError } from '@unshared/validation'
import { assertMcpGateway } from './assertMcpGateway'

describe('assertMcpGateway', () => {
  const id = '550e8400-e29b-41d4-a716-446655440000'
  const address = 'gateway.mcp.example.com'
  const identity = 'gateway-eu-west-1-1'

  describe('pass', () => {
    it('should assert a valid gateway', () => {
      const shouldPass = () => assertMcpGateway({ id, address, identity })
      expect(shouldPass).not.toThrow()
    })
  })

  describe('fail', () => {
    describe('id', () => {
      it('should throw if id is not a valid UUID', () => {
        const shouldFail = () => assertMcpGateway({ id: 'invalid-uuid', address, identity })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if id is missing', () => {
        const shouldFail = () => assertMcpGateway({ address, identity })
        expect(shouldFail).toThrow(AssertionError)
      })
    })

    describe('address', () => {
      it('should throw if address is not a non-empty string', () => {
        const shouldFail = () => assertMcpGateway({ id, address: '', identity })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if address is missing', () => {
        const shouldFail = () => assertMcpGateway({ id, identity })
        expect(shouldFail).toThrow(AssertionError)
      })
    })

    describe('identity', () => {
      it('should throw if identity is not a non-empty string', () => {
        const shouldFail = () => assertMcpGateway({ id, address, identity: '' })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if identity is missing', () => {
        const shouldFail = () => assertMcpGateway({ id, address })
        expect(shouldFail).toThrow(AssertionError)
      })
    })
  })
})
