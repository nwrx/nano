import { defineNuxtConfig } from 'nuxt/config'
import { LOCALES } from './utils/locales'

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
    keepalive: {
      max: 10,
      include: [
        '/admin/**',
        '/settings/**',
      ],
    },
  },

  serverHandlers: [
    { route: '/api/**', handler: '~/server/index.ts' },
    { route: '/ws/**', handler: '~/server/index.ts' },
  ],

  modules: [
    'nuxt-security',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@unshared/vue',
    '@unserved/nuxt',
    // '@nuxtjs/storybook',
  ],

  /**
   * The `nuxt-security` module provides a set of security headers and features to protect
   * the application from common web vulnerabilities and attacks.
   *
   * @see https://nuxt-security.vercel.app/
   */
  security: {
    enabled: false,
    hidePoweredBy: true,
    rateLimiter: {
      headers: true,
      interval: 60 * 1000,
      tokensPerInterval: 1000,
    },
    headers: {
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
          '\'self\'',
          'localhost:*',
        ],
        'frame-src': [
          '\'self\'',
          'http://localhost:*',
          'https://*',
        ],
        'connect-src': [
          '\'self\'',
          'ws://localhost:*',
          'http://localhost:*',
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
      { name: 'Fira Code', provider: 'google' },
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
   * I18n (Internationalization) module for your Nuxt project powered by Vue I18n.
   *
   * @see https://i18n.nuxtjs.org/
   */
  i18n: {
    lazy: true,
    strategy: 'no_prefix',
    defaultLocale: 'en-US',
    locales: LOCALES,
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

  storybook: {
    enabled: true,
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

  /**
   * Configuration for Nuxt's TypeScript integration. We extend the `include` option
   * to include the Storybook configuration file. This is necessary to ensure that
   * ESLint and TypeScript checks are run on the Storybook configuration file.
   */
  typescript: {
    tsConfig: {
      include: [
        '../.storybook/*.ts',
      ],
    },
  },

  vite: {
    optimizeDeps: {
      exclude: [
        '@unserved/nuxt/useClient',
        '@unserved/nuxt/useRequest',
      ],
      include: [
        'date-fns/locale/de',
        'date-fns/locale/en-US',
        'date-fns/locale/fr',
        'date-fns/locale/zh-CN',
        'date-fns/locale/es',

        /**
         * Fixes the `index.js does not provide an export named 'parse'` error introduced
         * in `storybook@8.3.?` when using the `jsdoc-type-pratt-parser` package.
         *
         * @see https://github.com/nuxt-modules/storybook/issues/776
         */
        '@storybook/addon-docs',
        'jsdoc-type-pratt-parser',
      ],
    },
    server: {
      hmr: {
        port: Number.parseInt(process.env.PORT ?? '3000') + 1,
      },
    },
  },
})
