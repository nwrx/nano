import { assert, createRuleChain, createRuleSet } from '@unshared/validation'

export function assertStringDuration(defaultValue?: number) {
  if (defaultValue !== undefined) {
    return createRuleSet(
      [assert.undefined, () => defaultValue],
      [
        assert.stringNotEmpty.withMessage('The duration cannot be an empty string.'),
        assert.stringNumber.withMessage('The duration must be a string representing a positive number of milliseconds.'),
        Number.parseInt,
        assert.numberPositive.withMessage('The duration must be a positive number of milliseconds.'),
      ],
    )
  }
  return createRuleChain(
    assert.stringNotEmpty.withMessage('The duration cannot be an empty string.'),
    assert.stringNumber.withMessage('The duration must be a string representing a positive number of milliseconds.'),
    Number.parseInt,
    assert.numberPositive.withMessage('The duration must be a positive number of milliseconds.'),
  )
}
