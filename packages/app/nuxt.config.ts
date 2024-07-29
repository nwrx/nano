import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: false,

  routeRules: {
    '/_/**': { ssr: false, appMiddleware: ['auth'] },
    '/api/**': { ssr: false, cors: true },
    '/auth/**': { ssr: false, appMiddleware: ['unauth'] },
  },

  /**
   * Configure Nuxt component auto-registration. Any components in the directories
   * configured here can be used throughout your pages, layouts (and other components)
   * without needing to explicitly import them.
   *
   * @see https://nuxt.com/docs/guide/directory-structure/components
   */
  components: {
    dirs: [{
      path: './components',
      pathPrefix: false,
    }],
  },
})
