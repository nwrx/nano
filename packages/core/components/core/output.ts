import { defineComponent } from '../../utils/defineComponent'

export const output = defineComponent(
  {
    isTrusted: true,
    inputs: {
      name: {
        'type': 'string',
        'name': 'Name',
        'description': 'The name of the output value.',
        'x-control': 'text',
      },
      description: {
        'type': 'string',
        'name': 'Description',
        'control': 'text',
        'description': 'A short description that explains the purpose of the output value.',
        'x-control': 'textarea',
        'x-optional': true,
      },
      value: {
        name: 'Value',
        description: 'The value to send to the ouput.',
        oneOf: [
          { 'x-type': 'stream' },
          { 'x-type': 'file' },
          { type: 'array' },
          { type: 'object' },
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
        ],
      },
    },
  },
  async({ data, thread, nodeId }) => {
    thread.output[data.name] = data.value

    // --- If the value is a stream, send the stream as events.
    if (data.value instanceof ReadableStream) {
      const reader = data.value.getReader() as ReadableStreamDefaultReader<string>
      thread.dispatch('nodeOutputDeltaStart', nodeId, data.name)
      while (true) {
        const { value, done } = await reader.read()
        if (value) thread.dispatch('nodeOutputDelta', nodeId, data.name, value)
        if (done) break
      }
      thread.dispatch('nodeOutputDeltaEnd', nodeId, data.name)
    }

    // --- Otherwise, send back as-is.
    else {
      thread.dispatch('nodeOutput', nodeId, data.name, data.value)
    }

    // --- Empty return.
    return {}
  },
)
