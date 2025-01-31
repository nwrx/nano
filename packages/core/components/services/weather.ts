import { defineComponent } from '../../utils/defineComponent'

export const weather = defineComponent(
  {
    title: 'Weather',
    icon: 'https://api.iconify.design/carbon:sun.svg',
    description: 'The **Weather Tool** node is designed to fetch the current weather information for a given location. The node requires a location as input and returns the current weather information for that location.',
    inputs: {
      location: {
        type: 'string',
        title: 'Location',
        description: 'The location for which to fetch the weather information.',
      },
    },
    outputs: {
      weather: {
        title: 'Tool',
        type: 'string',
        description: 'The current weather information for the given location.',
      },
    },
  },
  async({ data }) => {
    const { location } = data
    const response = await fetch(`https://wttr.in/${location}?format=%C+%t+%w+%m+%l+%p`, { headers: { Accept: 'text/plain' } })
    if (!response.ok) throw new Error('The weather information could not be fetched.')
    return { weather: await response.text() }
  },
)
