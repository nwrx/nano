import { assert, createRuleSet } from '@unshared/validation'
import { Readable } from 'node:stream'

/** Asserts that the given value is a valid `FileLikeData`. */
export const assertFileLikeData = createRuleSet(
  [assert.instanceOf(Buffer)],
  [assert.instanceOf(Readable)],
  [assert.instanceOf(ReadableStream)],
  [assert.stringNotEmpty],
)

/** Represents data that can be uploaded as a file. */
export type FileLikeData = ReturnType<typeof assertFileLikeData>
