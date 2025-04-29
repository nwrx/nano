import { z } from 'zod'
import { defineTool } from './defineTool'

describe('defineTool', () => {
  it('should create a tool with a schema', () => {
    const handler = vi.fn()
    const tool = defineTool({
      name: 'echo',
      description: 'Echo the input.',
      inputSchema: { type: 'object' },
    }, handler)
    expect(tool).toEqual({
      name: 'echo',
      description: 'Echo the input.',
      inputSchema: { type: 'object' },
      handler,
    })
  })

  it('should create a tool with a parser', () => {
    const handler = vi.fn()
    const parseInput = z.object({ message: z.string() })
    const tool = defineTool({
      name: 'echo',
      description: 'Echo the input.',
      parseInput,
    }, handler)
    expect(tool).toEqual({
      name: 'echo',
      description: 'Echo the input.',
      parseInput,
      handler,
    })
  })
})
