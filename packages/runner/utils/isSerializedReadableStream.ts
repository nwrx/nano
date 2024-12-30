import type { SerializedReadableStream } from './deserializeReadableStream'
import { MessagePort } from 'node:worker_threads'

export function isSerializedReadableStream(value: unknown): value is SerializedReadableStream {
  return typeof value === 'object'
    && value !== null
    && '@instanceOf' in value
    && value['@instanceOf'] === 'ReadableStream'
    && 'port' in value
    && value.port instanceof MessagePort
}
