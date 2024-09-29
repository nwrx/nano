import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({

  ssr: false,
  compatibilityDate: '2024-07-09',
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  app: {
    rootId: 'app',
    rootTag: 'div',
    buildAssetsDir: '/static/',
    baseURL: '/',
  },

  routeRules: {
    '/api/**': {
      security: {
        enabled: false,
      },
    },
  },

  serverHandlers: [{
    route: '/api/**',
    handler: '~/server/index.ts',
  }],

  modules: [
    'nuxt-security',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@unshared/vue',
    '@unserved/nuxt',
  ],

  /**
   * The `nuxt-security` module provides a set of security headers and features to protect
   * the application from common web vulnerabilities and attacks.
   *
   * @see https://nuxt-security.vercel.app/
   */
  security: {
    enabled: true,
    nonce: true,
    rateLimiter: {
      headers: true,
      interval: 60 * 1000,
      tokensPerInterval: 1000,
    },
    headers: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        'img-src': [
          '\'self\'',
          'data:',
          'blob:',
          'https://*',
        ],
        'script-src': [
          '\'nonce-{{nonce}}\'',
          '\'strict-dynamic\'',
        ],
        'frame-src': [
          '\'self\'',
          'https://*',
        ],
      },
    },
  },

  /**
   * Configuration for @nuxt/fonts
   *
   * @see — https://www.npmjs.com/package/@nuxt/fonts
   */
  fonts: {
    defaults: {
      weights: ['200', '300', '400', '500', '600', '700', '800'],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
    },
    families: [
      { name: 'IBM Plex Sans', provider: 'google' },
      { name: 'IBM Plex Serif', provider: 'google' },
      { name: 'IBM Plex Mono', provider: 'google' },
    ],
  },

  /**
   * UnoCSS is the instant atomic CSS engine, that is designed to be flexible and extensible.
   * The core is un-opinionated and all the CSS utilities are provided via presets.
   *
   * @see https://unocss.dev/guide/
   */
  unocss: {
    preflight: true,
    configFile: './uno.config.ts',
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
      path: new URL('components', import.meta.url).pathname,
      pattern: '**/*.vue',
      pathPrefix: false,
    }],
  },

  /**
   * Enables the experimental <NuxtClientFallback> component for rendering content on
   * the client if there's an error in SSR.
   *
   * @see https://nuxt.com/docs/guide/going-further/experimental-features#clientfallback
   * @see https://nuxt.com/docs/guide/going-further/experimental-features#payloadExtraction
   */
  experimental: {
    clientFallback: true,
  },

  /**
   * Additional router options passed to vue-router. On top of the options for vue-router,
   * Nuxt offers additional options to customize the router.
   *
   * @see https://router.vuejs.org/api/interfaces/RouterOptions.html
   */
  router: {
    options: {
      end: true,
      strict: true,
      sensitive: true,
      linkActiveClass: 'active',
      linkExactActiveClass: 'exact-active',
      scrollBehaviorType: 'smooth',
    },
  },

  /**
   * Enable `experimentalDecorator` when bundling the server code with Vite. It
   * allows use to use decorators when declaring the TypeORM entities.
   *
   * @see https://typeorm.io/#typescript-configuration
   */
  nitro: {
    experimental: {
      websocket: true,
    },
    esbuild: {
      options: {
        target: 'esnext',
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true,
          },
        },
      },
    },
  },

  vite: {
    optimizeDeps: {
      exclude: [
        '@unserved/nuxt/useClient',
        '@unserved/nuxt/useRequest',
      ],
    },
    server: {
      hmr: {
        port: Number.parseInt(process.env.PORT ?? '3000') + 1,
      },
    },
  },
})
