import { defineType } from '@nwrx/core'
import { assert } from '@unshared/validation'

export const file = defineType({
  kind: 'file',
  name: 'File',
  color: '#EEDCFF',
  description: 'A file on the filesystem.',
  parse: assert.instance(File),
})
