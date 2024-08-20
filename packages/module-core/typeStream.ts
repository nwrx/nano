/* eslint-disable n/no-unsupported-features/node-builtins */
import { defineFlowType } from '@nanoworks/core'
import { createAssertInstance, createParser } from '@unshared/validation'

export const typeStream = defineFlowType({
  kind: 'stream',
  name: 'Stream',
  color: '#EEDCFF',
  description: 'A stream of data that can be read or written.',
  parse: createParser(
    [createAssertInstance(ReadableStream<Uint8Array>)],
  ),
})
