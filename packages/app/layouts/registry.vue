<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const title = computed(() => t(`title.${route.name as string}`))

useHead(() => ({
  title: title.value,
  meta: [{ hid: 'description', name: 'description', content: t('description') }],
}))

// --- Registry composables
const registry = useRegistryExplorer()
const featured = computed(() => registry.categories.value.filter(category => category.type === 'Featured'))
const technology = computed(() => registry.categories.value.filter(category => category.type === 'Technology'))
const industries = computed(() => registry.categories.value.filter(category => category.type === 'Industry'))
watch(registry.search, registry.searchCategories, { immediate: true })
</script>

<template>
  <AppLayout>
    <AppPage>

      <!-- Header -->
      <AppPageHeader
        icon="i-carbon:user"
        :title="[t('title'), title]"
        :description="t('description')"
      />

      <!-- Side menu -->
      <div class="flex w-full h-full overflow-x-hidden overflow-y-auto">
        <AppPageNav class="shrink-0 h-full sticky top-0 overflow-y-auto">

          <!-- Search -->
          <InputText v-model="registry.search" placeholder="Search categories" />

          <!-- Categories -->
          <AppPageNavGroup v-if="featured.length > 0" label="Featured">
            <AppPageNavItem
              v-for="x in featured"
              :key="x.name"
              :label="x.title"
              :icon="x.icon"
              compact
              :to="{ name: 'Registry', params: { category: x.name } }"
            />
          </AppPageNavGroup>

          <!-- Industries -->
          <AppPageNavGroup v-if="industries.length > 0" label="Industries">
            <AppPageNavItem
              v-for="x in industries"
              :key="x.name"
              :label="x.title"
              :icon="x.icon"
              compact
              :to="{ name: 'Registry', params: { category: x.name } }"
            />
          </AppPageNavGroup>

          <!-- Technologies -->
          <AppPageNavGroup v-if="technology.length > 0" label="Technologies">
            <AppPageNavItem
              v-for="x in technology"
              :key="x.name"
              :label="x.title"
              :icon="x.icon"
              compact
              :to="{ name: 'Registry', params: { category: x.name } }"
            />
          </AppPageNavGroup>
        </AppPageNav>

        <!-- Content -->
        <div class="relative w-full">
          <NuxtPage transition />
        </div>
      </div>
    </AppPage>
  </AppLayout>
</template>
