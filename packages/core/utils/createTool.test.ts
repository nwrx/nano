/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTool } from './createTool'

describe('createTool', () => {
  it('should create a tool with the given properties', () => {
    const call = () => Promise.resolve('It is sunny.')
    const result = createTool({
      // @ts-expect-error: extra property
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
      name: 'Weather Forecast',
      description: 'A tool that can be used to get the weather forecast.',
      parameters: {
        type: 'object',
        required: ['location'],
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
          __toolMessage: {
            type: 'string',
            description: expect.any(String),
          },
          __toolName: {
            type: 'string',
            description: expect.any(String),
          },
        },
      },
    })
  })

  it('should not include extra properties', () => {
    const call = () => Promise.resolve({ weather: 'sunny' })
    const result = createTool({
      call,
      name: 'Weather Forecast',
      description: 'A tool that can be used to get the weather forecast.',
      properties: {},
      // @ts-expect-error: extra property
      extra: 'property',
    })
    expect(result).toStrictEqual({
      call,
      name: 'Weather Forecast',
      description: 'A tool that can be used to get the weather forecast.',
      parameters: {
        properties: {
          __toolMessage: {
            type: 'string',
            description: expect.any(String),
          },
          __toolName: {
            type: 'string',
            description: expect.any(String),
          },
        },
        required: [],
        type: 'object',
      },
    })
  })
})
