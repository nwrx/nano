import type { Tool } from '@modelcontextprotocol/sdk/types.js'
import type { OpenAPIV2 } from '@unshared/client/openapi'
import type { Pretty } from '@unshared/types'
import type { z } from 'zod'
import type { MCP } from './createMcp'

export interface McpToolOptions {
  name: string
  description?: string
  inputSchema?: Tool['inputSchema']
  parseInput?: z.ZodSchema<any>
}

export type McpToolParametersInput<T extends McpToolOptions> =
  T extends { parseInput: infer U extends z.ZodSchema<any> } ? z.infer<U>
    : T extends { inputSchema: OpenAPIV2.InferSchemaObject<infer I> } ? Pretty<I>
      : object

export interface McpToolInput<T extends McpToolOptions> {
  input: McpToolParametersInput<T>
  server: MCP
}

export type McpToolHandler<
  T extends McpToolOptions = McpToolOptions,
  R extends object = object,
> = (input: McpToolInput<T>) => R

export type McpTool<
  T extends McpToolOptions = McpToolOptions,
  R extends object = object,
> =
  & Omit<T, 'inputSchema'>
  & {
    inputSchema: Tool['inputSchema']
    handler: McpToolHandler<T, R>
  }

export function defineTool<T extends McpToolOptions, R extends object>(options: T, handler: McpToolHandler<T, R>): McpTool<T, R> {
  return {
    name: options.name,
    description: options.description,
    inputSchema: options.inputSchema,
    parseInput: options.parseInput,
    handler,
  } as McpTool<T, R>
}
