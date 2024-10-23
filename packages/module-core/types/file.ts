import { defineType } from '@nwrx/core'
import { assertStringNotEmpty, createAssertInstance, createParser } from '@unshared/validation'

export const file = defineType({
  kind: 'stream',
  name: 'File',
  color: '#EEDCFF',
  description: 'A file that can be read or written.',
  parse: createParser({
    name: assertStringNotEmpty,
    type: assertStringNotEmpty,
    file: createAssertInstance(File),
  }),
})
