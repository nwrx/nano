import { AssertionError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { assertMcpPool } from './assertMcpPool'

describe('assertMcpPool', () => {
  describe('pass', () => {
    it('should assert a valid MCP pool with minimal fields', () => {
      const shouldPass = () => assertMcpPool({ id: randomUUID(), name: 'my-mcp-pool' })
      expect(shouldPass).not.toThrow()
    })

    it('should assert a valid MCP pool with workspace', () => {
      const shouldPass = () => assertMcpPool({
        id: randomUUID(),
        name: 'my-mcp-pool',
        workspace: { id: randomUUID(), name: 'my-workspace' },
      })
      expect(shouldPass).not.toThrow()
    })
  })

  describe('fail', () => {
    it('should throw an error if the MCP pool id is not a UUID', () => {
      const shouldThrow = () => assertMcpPool({ id: 'invalid', name: 'my-mcp-pool' })
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the MCP pool id is missing', () => {
      const shouldThrow = () => assertMcpPool({ name: 'my-mcp-pool' })
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the MCP pool name is empty', () => {
      const shouldThrow = () => assertMcpPool({ id: randomUUID(), name: '' })
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the MCP pool name is missing', () => {
      const shouldThrow = () => assertMcpPool({ id: randomUUID() })
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the workspace has invalid id', () => {
      const shouldThrow = () => assertMcpPool({
        id: randomUUID(),
        name: 'my-mcp-pool',
        workspace: { id: 'invalid', name: 'my-workspace' },
      })
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the workspace has empty name', () => {
      const shouldThrow = () => assertMcpPool({
        id: randomUUID(),
        name: 'my-mcp-pool',
        workspace: { id: randomUUID(), name: '' },
      })
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the input is not an object', () => {
      const shouldThrow = () => assertMcpPool('invalid')
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the input is null', () => {
      const shouldThrow = () => assertMcpPool(null)
      expect(shouldThrow).toThrow(AssertionError)
    })

    it('should throw an error if the input is undefined', () => {
      const shouldThrow = () => assertMcpPool(undefined)
      expect(shouldThrow).toThrow(AssertionError)
    })
  })
})
