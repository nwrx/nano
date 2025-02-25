<script setup lang="ts">
definePageMeta({
  name: 'Registry',
  path: '/registry/:category?',
  alias: '/registry',
  middleware: 'redirect-when-guest',
  layout: 'registry',
})

const { t } = useI18n()
useHead(() => ({
  title: t('title'),
  meta: [{ name: 'description', content: t('description') }],
}))

// --- Extract route parameters.
const route = useRoute()
const options = computed(() => ({
  categories: route.params.category ? [route.params.category] : [],
  withCollections: true,
  withCategories: true,
  withWorkspace: true,
})) as Ref<UseRegistryCollectionsOptions>

const collections = useRegistryCollections(options)
watch(options, collections.searchCollections, { immediate: true })
</script>

<template>
  <AppPageContainer contained>
    <RegistryCollectionList
      v-if="collections.data.value.length > 0"
      :collections="collections.data.value"
    />
  </AppPageContainer>
</template>
