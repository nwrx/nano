import type { MaybePromise } from '@unshared/types'
import type { ReadableStream } from 'node:stream/web'
import { defineType } from '@nwrx/core'
import { assert, assertFunction, createSchema } from '@unshared/validation'

export const file = defineType({
  kind: 'file',
  name: 'File',
  color: '#EEDCFF',
  description: 'File that contains data.',
  parse: createSchema({
    id: assert.stringNotEmpty,
    name: assert.stringNotEmpty,
    type: assert.stringNotEmpty,
    getUrl: assertFunction<() => MaybePromise<string>>,
    getLength: assertFunction<() => MaybePromise<number>>,
    getStream: assertFunction<() => MaybePromise<ReadableStream>>,
  }),
})
