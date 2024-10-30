import unshared from '@unshared/eslint-config'

export default [
  ...unshared(),
  {
    rules: {
      'sonarjs/new-cap': 'off',
      'sonarjs/void-use': 'off',
      'vitest/valid-describe-callback': 'off',
    },
  },
]
