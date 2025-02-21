import { anthropicNormalizeMessage } from './anthropicNormalizeMessage'

describe('anthropicNormalizeMessage', () => {
  it('should normalize a string message correctly', async() => {
    const result = await anthropicNormalizeMessage('Hello, world!')
    expect(result).toStrictEqual({
      role: 'user',
      content: 'Hello, world!',
    })
  })

  it('should normalize a user message correctly', async() => {
    const result = await anthropicNormalizeMessage({
      role: 'user',
      content: 'Hello, world!',
    })
    expect(result).toStrictEqual({
      role: 'user',
      content: 'Hello, world!',
    })
  })

  it('should normalize an assistant message correctly', async() => {
    const result = await anthropicNormalizeMessage({
      role: 'assistant',
      content: 'Hello, world!',
    })
    expect(result).toStrictEqual({
      role: 'assistant',
      content: 'Hello, world!',
    })
  })

  it('should normalize a tool request message correctly', async() => {
    const result = await anthropicNormalizeMessage({
      role: 'tool_request',
      id: 'tool_123',
      name: 'example_tool',
      input: { example_input: 'example_value' },
    })
    expect(result).toStrictEqual({
      role: 'assistant',
      content: [{
        type: 'tool_use',
        id: 'tool_123',
        name: 'example_tool',
        input: { example_input: 'example_value' },
      }],
    })
  })

  it('should normalize a tool result message correctly', async() => {
    const result = await anthropicNormalizeMessage({
      role: 'tool_result',
      id: 'tool_123',
      result: { example_output: 'example_value' },
    })
    expect(result).toStrictEqual({
      role: 'user',
      content: [{
        type: 'tool_result',
        tool_use_id: 'tool_123',
        is_error: false,
        content: '{"example_output":"example_value"}',
      }],
    })
  })

  it('should normalize a tool result message with an error correctly', async() => {
    const result = await anthropicNormalizeMessage({
      role: 'tool_result',
      id: 'tool_123',
      error: 'Example error message.',
    })
    expect(result).toStrictEqual({
      role: 'user',
      content: [{
        type: 'tool_result',
        tool_use_id: 'tool_123',
        is_error: true,
        content: '{"error":"Example error message."}',
      }],
    })
  })

  it('should throw an error for an unsupported message role', async() => {
    // @ts-expect-error: test invalid input
    const result = anthropicNormalizeMessage({ role: 'unsupported_role', content: 'Hello, world!' })
    await expect(result).rejects.toThrow('The message role "unsupported_role" is not supported.')
  })
})
