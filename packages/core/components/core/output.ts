import { isArrayBufferView } from 'node:util/types'
import { defineComponent } from '../../utils/defineComponent'

export const output = defineComponent(
  {
    isTrusted: true,
    inputs: {
      name: {
        'type': 'string',
        'title': 'Name',
        'description': 'The name of the output value.',
        'x-control': 'text',
      },
      description: {
        'type': 'string',
        'title': 'Description',
        'control': 'text',
        'description': 'A short description that explains the purpose of the output value.',
        'x-control': 'textarea',
        'x-optional': true,
      },
      value: {
        title: 'Value',
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
      const reader = data.value.getReader() as ReadableStreamDefaultReader<string | Uint8Array>
      const chunks: unknown[] = []
      thread.dispatch('nodeOutputDeltaStart', nodeId, data.name)
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        if (!value) continue
        thread.dispatch('nodeOutputDelta', nodeId, data.name, value)
        chunks.push(value)
      }

      // --- Send the final value.
      let result: string | Uint8Array
      if (typeof chunks[0] === 'string') {
        result = chunks.join('')
      }
      else {
        let length = 0
        for (const chunk of chunks) length += (chunk as Uint8Array).length
        const array = new Uint8Array(length)
        for (let i = 0, offset = 0; i < chunks.length; i++) {
          const chunk = chunks[i] as Uint8Array
          array.set(chunk, offset)
          offset += chunk.length
        }
        result = array
      }

      thread.output[data.name] = result
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
