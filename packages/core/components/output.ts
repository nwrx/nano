/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { defineComponent } from '../utils/defineComponent'

export type EventMapOutput = {
  'nodeOutput': [nodeId: string, name: string, value: unknown]
  'nodeOutputDeltaStart': [nodeId: string, name: string]
  'nodeOutputDelta': [nodeId: string, name: string, value: string | Uint8Array]
  'nodeOutputDeltaEnd': [nodeId: string, name: string]
}

export const output = defineComponent(
  {
    isTrusted: true,
    name: 'output',
    purpose: 'control',
    icon: 'carbon:port-output',
    title: {
      en: 'Output',
      fr: 'Sortie',
      de: 'Ausgabe',
      es: 'Salida',
      zh: '输出',
    },
    description: {
      en: 'Define output values for the flow execution, supporting streams and various data types.',
      fr: 'Définir les valeurs de sortie pour l\'exécution du flux, supportant les flux et divers types de données.',
      de: 'Ausgabewerte für die Flussausführung definieren, mit Unterstützung für Streams und verschiedene Datentypen.',
      es: 'Definir valores de salida para la ejecución del flujo, soportando streams y varios tipos de datos.',
      zh: '为流程执行定义输出值，支持流和各种数据类型。',
    },
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
