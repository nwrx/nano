/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import type { Immutable } from '@unshared/types'
import type { MCP } from './createMcp'

export interface McpPromptOptions {
  name: string
  description?: string
  arguments?: ReadonlyArray<string | {
    name: string
    description?: string
    required?: boolean
  }>
}

export type McpPromptParametersArguments<T extends McpPromptOptions> =
  T extends { arguments: Array<infer U> | ReadonlyArray<infer U> }
    ? { [P in U extends string ? U : U extends { name: infer V extends string } ? V : never]: string }
    : Record<string, string>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const options = {
  name: 'prompt',
  description: 'A prompt',
  arguments: ['arg1', 'arg2', { name: 'arg3' }],
} as const satisfies McpPromptOptions

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Test = McpPromptParametersArguments<typeof options>

export interface McpPromptInput<T extends McpPromptOptions> {
  args: McpPromptParametersArguments<T>
  server: MCP
}

export interface McpPromptMessage {
  role: 'assistant' | 'system' | 'user'
  content: { type: 'text'; text: string }
}

export type McpPromptHandler<
  T extends McpPromptOptions = McpPromptOptions,
> = (input: McpPromptInput<T>) => McpPromptMessage[]

export type McpPrompt<
  T extends McpPromptOptions = McpPromptOptions,
> =
  & T
  & { handler: McpPromptHandler<T> }

export function definePrompt<T extends McpPromptOptions>(
  options: Immutable<T>,
  handler: McpPromptHandler<T>,
): McpPrompt<T> {
  return {
    name: options.name,
    description: options.description,
    arguments: options.arguments,
    handler,
  } as McpPrompt<T>
}
