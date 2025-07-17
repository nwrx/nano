import type { McpServerSpec } from './assertMcpServerSpec'
import { AssertionError } from '@unshared/validation'
import { randomUUID } from 'node:crypto'
import { assertMcpServer } from './assertMcpServer'

describe('assertMcpServer', () => {
  const id = randomUUID()
  const name = 'my-mcp-server'
  const spec: McpServerSpec = {
    image: 'mcp/fetch:latest',
    command: ['fetch', 'https://example.com'],
    idleTimeout: 300,
    transport: { type: 'stdio', port: 8080 },
  }

  describe('pass', () => {
    it('should assert a valid MCP server with minimal fields', () => {
      const shouldPass = () => assertMcpServer({ id, name, spec })
      expect(shouldPass).not.toThrow()
    })
  })

  describe('fail', () => {
    describe('id', () => {
      it('should throw if id is not a valid UUID', () => {
        const shouldFail = () => assertMcpServer({ id: 'invalid-uuid', name, spec })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if id is not a string', () => {
        const shouldFail = () => assertMcpServer({ id: 123, name, spec })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if id is not provided', () => {
        const shouldFail = () => assertMcpServer({ name, spec })
        expect(shouldFail).toThrow(AssertionError)
      })
    })

    describe('name', () => {
      it('should throw if name is not a non-empty string', () => {
        const shouldFail = () => assertMcpServer({ id, name: '', spec })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if name is not a string', () => {
        const shouldFail = () => assertMcpServer({ id, name: 123, spec })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if name is not provided', () => {
        const shouldFail = () => assertMcpServer({ id, spec })
        expect(shouldFail).toThrow(AssertionError)
      })
    })

    describe('spec', () => {
      it('should throw if spec is not provided', () => {
        const shouldFail = () => assertMcpServer({ id, name })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if spec is not an object', () => {
        const shouldFail = () => assertMcpServer({ id, name, spec: 'not-an-object' })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if spec.image is not a string', () => {
        const shouldFail = () => assertMcpServer({ id, name, spec: { ...spec, image: 123 } })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if spec.command is not an array of non-empty strings', () => {
        const shouldFail = () => assertMcpServer({ id, name, spec: { ...spec, command: [''] } })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if spec.idleTimeout is not a positive integer or string number', () => {
        const shouldFail = () => assertMcpServer({ id, name, spec: { ...spec, idleTimeout: -1 } })
        expect(shouldFail).toThrow(AssertionError)
      })

      it('should throw if spec.transport is not valid', () => {
        const shouldFail = () => assertMcpServer({ id, name, spec: { ...spec, transport: { type: 'invalid-type' } } })
        expect(shouldFail).toThrow(AssertionError)
      })
    })
  })
})
