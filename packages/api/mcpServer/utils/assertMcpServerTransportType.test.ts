import type { McpServerTransportType } from './assertMcpServerTransportType'
import { AssertionError } from '@unshared/validation'
import { assertMcpServerTransportType, MCP_SERVER_TRANSPORT_TYPES } from './assertMcpServerTransportType'

describe('assertMcpTransportType', () => {
  it.each(MCP_SERVER_TRANSPORT_TYPES)('should assert a transport type is %s', (type) => {
    const shouldPass = () => assertMcpServerTransportType(type)
    expect(shouldPass).not.toThrow()
  })

  it('should throw an error if the transport type is not valid', () => {
    const shouldThrow = () => assertMcpServerTransportType('invalid' as any)
    const values = MCP_SERVER_TRANSPORT_TYPES.map(value => `'${value}'`).join(', ')
    expect(shouldThrow).toThrow(AssertionError)
    expect(shouldThrow).toThrow(`String is not one of the values: ${values}`)
  })

  it('should infer the transport type', () => {
    type Expected = typeof MCP_SERVER_TRANSPORT_TYPES[number]
    expectTypeOf<McpServerTransportType>().toEqualTypeOf<Expected>()
  })
})
