import { assert, createRuleMap, createRuleSet } from '@unshared/validation'
import { assertFileLikeData } from './assertFileLikeData'

/** Asserts that the given value is a valid `FileLike` object. */
export const assertFileLike = createRuleSet(
  [assert.instanceOf(File)],
  [createRuleMap({
    data: assertFileLikeData,
    name: assert.stringNotEmpty,
    type: assert.stringNotEmpty,
    size: assert.numberGreaterThanOrEqual(0),
  })],
)

/** Represents a file-like object that can be uploaded. */
export type FileLike = ReturnType<typeof assertFileLike>
