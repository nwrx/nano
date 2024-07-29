// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { application } from '~/server'

declare module '#imports' {
  interface Server {
    application: typeof application
  }
}
