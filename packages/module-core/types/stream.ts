/* eslint-disable n/no-unsupported-features/node-builtins */
import { defineSocketType } from '@nwrx/core'
import { createAssertInstance, createParser } from '@unshared/validation'

export const stream = defineSocketType({
  kind: 'stream',
  name: 'Stream',
  color: '#EEDCFF',
  description: 'A stream of data that can be read or written.',
  parse: createParser(
    [createAssertInstance(ReadableStream<Uint8Array>)],
  ),
})
