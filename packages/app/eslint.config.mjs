import unshared from '@unshared/eslint-config'

export default [
  ...unshared(),
  {
    rules: {
      'vue/valid-v-slot': 'off',
      'sonarjs/new-cap': 'off',
      'sonarjs/void-use': 'off',
      'sonarjs/sonar-no-unused-vars': 'off',
      'sonarjs/no-empty-function': 'off',
      'vitest/valid-describe-callback': 'off',
    },
  },
]
