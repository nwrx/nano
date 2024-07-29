<script setup lang="ts">
import type { ContentWebsiteObject } from '@unserved/server'

const router = useRouter()
const client = useClient()

// --- Provide data to the child components.
const route = computed(() => router.currentRoute.value)
const meta = computed(() => route.value.meta as { title: string })

// --- Fetch website data.
const { data: website } = await client.useRequest('GET /api/website', {
  default: () => ({}) as ContentWebsiteObject,
})

// --- Head.
useHead({
  titleTemplate: `${website.value.name} - %s`,
  link: [
    { rel: 'icon', type: 'image/x-icon', href: website.value.iconUrl },
    { rel: 'apple-touch-icon', href: website.value.iconUrl },
  ],
})

// --- SEO.
useSeoMeta({
  charset: 'utf8',
  title: meta.value.title,
  ogUrl: website.value.url,
  ogTitle: meta.value.title,
  ogSiteName: website.value.name,
  ogDescription: website.value.description,
  viewport: 'width=device-width, initial-scale=1.0',
  description: website.value.description,
  themeColor: primary['600'],
  applicationName: website.value.name,
})
</script>

<template>
  <Suspense>
    <div id="app" class="font-sans">
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <slot>
          <NuxtPage />
        </slot>
      </NuxtLayout>
    </div>
  </Suspense>
</template>
