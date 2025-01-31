import { createTool } from './createTool'

describe('createTool', () => {
  it('should create a tool with the given properties', () => {
    const call = () => 'The weather is sunny.'
    const result = createTool({
      name: 'Weather Forecast',
      description: 'A tool that can be used to get the weather forecast.',
      schema: {},
      call,
    })
    expect(result).toStrictEqual({
      name: 'Weather Forecast',
      description: 'A tool that can be used to get the weather forecast.',
      schema: {},
      call,
    })
  })

  it('should not include extra properties', () => {
    const call = () => ({ weather: 'sunny' })
    const result = createTool({
      name: 'Weather Forecast',
      description: 'A tool that can be used to get the weather forecast.',
      schema: {},
      call,
      // @ts-expect-error: testing invalid input
      extra: 'property',
    })
    expect(result).toStrictEqual({
      name: 'Weather Forecast',
      description: 'A tool that can be used to get the weather forecast.',
      schema: {},
      call,
    })
  })
})
