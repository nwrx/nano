import unshared from '@unshared/eslint-config'
import turboConfig from 'eslint-config-turbo/flat'

export default [
  ...turboConfig,
  ...unshared(),
  {
    rules: {
      'n/hashbang': 'off',
      'vue/valid-v-slot': 'off',
      'sonarjs/new-cap': 'off',
      'sonarjs/void-use': 'off',
      'sonarjs/sonar-no-unused-vars': 'off',
      'vitest/valid-describe-callback': 'off',
    },
  },
]
