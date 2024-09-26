<script setup lang="ts">
const route = computed(() => useRouter().currentRoute.value)
const meta = computed(() => route.value.meta as { title: string })

useHead({
  titleTemplate: `%s | ${CONSTANTS.appTitle}`,
})

useSeoMeta({
  charset: 'utf8',
  title: meta.value.title,
  ogUrl: CONSTANTS.appCanonicalUrl,
  ogTitle: CONSTANTS.appTitle,
  ogSiteName: CONSTANTS.appTitle,
  ogDescription: CONSTANTS.appDescription,
  viewport: 'width=device-width, initial-scale=1.0',
  description: CONSTANTS.appDescription,
  themeColor: COLORS.primary['600'],
  applicationName: CONSTANTS.appTitle,
})
</script>

<template>
  <Suspense>
    <div id="app" class="font-sans overflow-x-clip">
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </Suspense>
</template>
