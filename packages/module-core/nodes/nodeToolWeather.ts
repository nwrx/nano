import type { JSONSchema4 } from 'json-schema'
import { defineComponent } from '@nwrx/core'
import { categoryLanguageModelTool } from '../categories'
import { languageModelTool, string } from '../types'

export const toolWeather = defineComponent({
  kind: 'core/weather-tool',
  name: 'Weather',
  icon: 'https://api.iconify.design/carbon:sun.svg',
  description: 'The **Weather Tool** node is designed to fetch the current weather information for a given location. The node requires a location as input and returns the current weather information for that location.',
  category: categoryLanguageModelTool,

  inputSchema: {
    name: {
      name: 'Name',
      type: string,
      control: 'text',
      description: 'The internal name used when passing the tool to the Language Model.',
      defaultValue: 'get_weather_forecast',
    },
    description: {
      name: 'Description',
      type: string,
      control: 'textarea',
      description: 'The description of the tool.',
      defaultValue: 'The current weather information for the given location.',
    },
  },

  // --- Define the outputs of the node.
  outputSchema: {
    weather: {
      name: 'Tool',
      type: languageModelTool,
      description: 'The current weather information for the given location.',
    },
  },

  // --- On processing the node, fetch the weather information for the given location.
  process: ({ data }) => ({
    weather: {
      name: data.name,
      description: data.description,
      schema: {
        type: 'object',
        required: ['location'],
        properties: {
          location: {
            type: 'string',
            description: 'The location for which to fetch the weather information.',
          },
        },
      } as JSONSchema4,
      call: async(data) => {
        const { location } = data as { location: string }
        const response = await fetch(`https://wttr.in/${location}?format=%C+%t+%w+%m+%l+%p`, { headers: { Accept: 'text/plain' } })
        if (!response.ok) throw new Error('The weather information could not be fetched.')
        return await response.text()
      },
    },
  }),
})
