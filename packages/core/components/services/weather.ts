import { defineComponent } from '../../utils/defineComponent'

export const weather = defineComponent(
  {
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
