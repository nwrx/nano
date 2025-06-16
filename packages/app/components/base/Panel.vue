<script setup lang="ts">
defineProps<{
  showSearch?: boolean
  searchPlaceholder?: string
}>()

const { t } = useI18n()
const search = defineModel('search', { default: '' })
</script>

<template>
  <div>

    <!-- Search -->
    <div
      v-if="showSearch"
      class="b-b b-app flex items-center justify-between p-md">
      <InputText
        v-model="search"
        type="text"
        :placeholder="searchPlaceholder ?? t('search')"
        icon="i-carbon:search"
      />
    </div>

    <!-- Content -->
    <slot />
  </div>
</template>

<i18n lang="yaml">
en:
  search: Search
fr:
  search: Rechercher
de:
  search: Suche
es:
  search: Buscar
zh:
  search: 搜索
</i18n>
