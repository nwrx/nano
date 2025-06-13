import { defineTool } from './defineTool'

describe('createTool', () => {
  it('should create a tool with the given properties', () => {
    const call = () => Promise.resolve({ weather: 'sunny' })
    const result = defineTool('example', {
      call,
      name: 'Weather Forecast',
      description: 'A tool that can be used to get the weather forecast.',
      properties: {
        location: {
          type: 'string',
          description: 'The location to get the weather forecast for.',
        },
        country: {
          'type': 'string',
          'description': 'The country of the location.',
          'x-optional': true,
        },
      },
    })
    expect(result).toStrictEqual({
      call,
      nodeId: 'example',
      name: 'Weather Forecast',
      description: 'A tool that can be used to get the weather forecast.',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        required: [
          'location',
          'country',
        ],
        properties: {
          location: {
            type: 'string',
            description: 'The location to get the weather forecast for.',
          },
          country: {
            'type': 'string',
            'description': 'The country of the location.',
            'x-optional': true,
          },
        },
      },
    })
  })

  it('should not include extra properties', () => {
    const call = () => Promise.resolve({ weather: 'sunny' })
    const result = defineTool('example', {
      call,
      name: 'Weather Forecast',
      description: 'A tool that can be used to get the weather forecast.',
      properties: {},
      // @ts-expect-error: extra property
      extra: 'property',
    })
    expect(result).toStrictEqual({
      call,
      nodeId: 'example',
      name: 'Weather Forecast',
      description: 'A tool that can be used to get the weather forecast.',
      inputSchema: {
        required: [],
        additionalProperties: false,
        properties: {},
        type: 'object',
      },
    })
  })
})
