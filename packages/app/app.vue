<script setup lang="ts">
const i18n = useI18n()
const route = useRoute()

useHead(() => ({
  title: localize(route.meta.title),
  titleTemplate: `%s • ${CONSTANTS.appTitle}`,
  htmlAttrs: {
    lang: i18n.locale,
  },
  link: [

    // Generic
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
    { rel: 'icon', type: 'image/png', sizes: '196x196', href: '/favicon-196x196.png' },

    // Android
    { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
    { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },

    // Microsoft
    { rel: 'icon', type: 'image/png', sizes: '70x70', href: '/mstile-70x70.png' },
    { rel: 'icon', type: 'image/png', sizes: '150x150', href: '/mstile-150x150.png' },
    { rel: 'icon', type: 'image/png', sizes: '310x310', href: '/mstile-310x310.png' },

    // Apple
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: COLORS.primary['500'] },
    { rel: 'shortcut icon', href: '/favicon.ico' },
    { rel: 'manifest', href: '/site.webmanifest' },
  ],

  meta: [
    // Route
    { hid: 'description', name: 'description', content: localize(route.meta.description) },

    // Generic
    { name: 'msapplication-TileColor', content: COLORS.primary['500'] },
    { name: 'msapplication-TileImage', content: '/mstile-144x144.png' },
    { name: 'theme-color', content: COLORS.primary['500'] },
    { name: 'application-name', content: CONSTANTS.appTitle },
    { name: 'description', content: CONSTANTS.appDescription },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'charset', content: 'utf8' },

    // Twitter
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:site', content: CONSTANTS.appTitle },
    { name: 'twitter:title', content: CONSTANTS.appTitle },
    { name: 'twitter:description', content: CONSTANTS.appDescription },
    { name: 'twitter:image', content: '/twitter-card.png' },

    // Open Graph
    { property: 'og:type', content: 'website' },
    // { property: 'og:image', content: '/og-image.png' },
    { property: 'og:url', content: CONSTANTS.appCanonicalUrl },
    { property: 'og:title', content: CONSTANTS.appTitle },
    { property: 'og:site_name', content: CONSTANTS.appTitle },
    { property: 'og:description', content: CONSTANTS.appDescription },
  ],
}))
</script>

<template>
  <Suspense>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </Suspense>
</template>
