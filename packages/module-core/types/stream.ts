import { defineType } from '@nwrx/core'
import { assert, createParser } from '@unshared/validation'

export const stream = defineType({
  kind: 'stream',
  name: 'Stream',
  color: '#EEDCFF',
  description: 'A stream of data that can be read or written.',
  parse: createParser(assert.instance(ReadableStream<Uint8Array>)),
})
