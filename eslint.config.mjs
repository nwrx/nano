import unsharedConfig from '@unshared/eslint-config'

export default [
  ...unsharedConfig({
    tsConfigPath: ['./tsconfig.json'],
  }),
  {
    files: ['**/*'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
]
