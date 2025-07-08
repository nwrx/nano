import * as core from './core'
// import * as models from './models'

export const COMPONENTS = {
  ...core,
  // ...models,
}

export type NativeComponentName = keyof typeof COMPONENTS
