<script setup lang="ts">
useHead({
  titleTemplate: `%s | ${CONSTANTS.appTitle}`,
})

useSeoMeta({
  charset: 'utf8',
  ogUrl: CONSTANTS.appCanonicalUrl,
  ogTitle: CONSTANTS.appTitle,
  ogSiteName: CONSTANTS.appTitle,
  ogDescription: CONSTANTS.appDescription,
  viewport: 'width=device-width, initial-scale=1.0',
  description: CONSTANTS.appDescription,
  themeColor: COLORS.primary['500'],
  applicationName: CONSTANTS.appTitle,
})
</script>

<template>
  <Suspense>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </Suspense>
</template>
