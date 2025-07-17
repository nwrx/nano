<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts" generic="T, K extends string">
import type { BaseTableProps, BaseTableSlots } from '@unshared/vue'
import { BaseTable } from '@unshared/vue/BaseTable'
import { useInfiniteScroll } from '@vueuse/core'
import InputText from './InputText.vue'

const props = defineProps<BaseTableProps<T, K>& {
  showSearch?: boolean
  isSearching?: boolean
  searchPlaceholder?: string
  onLoadMore?: () => any
}>()

const slots = defineSlots<BaseTableSlots<T, K>>()

const { t } = useI18n()
const element = ref<HTMLDivElement>()
const search = defineModel<string>('search')
const canLoadMore = ref(true)

// --- Implement infinite scroll with `@vueuse/core` useInfiniteScroll.
useInfiniteScroll(
  element,
  async() => {
    const beforeCount = Object.keys(props.rows ?? {}).length
    if (props.onLoadMore) await props.onLoadMore()
    const afterCount = Object.keys(props.rows ?? {}).length
    canLoadMore.value = afterCount > beforeCount
  },
  {
    distance: 10,
    throttle: 100,
    canLoadMore: () => canLoadMore.value,
  },
)
</script>

<template>
  <div class="w-full space-y-md">

    <!-- Search and sort fields -->
    <div v-if="showSearch" class="flex items-center justify-between">
      <InputText
        v-model="search"
        icon="i-carbon:search"
        :placeholder="searchPlaceholder ?? t('searchPlaceholder')"
        class="max-w-64"
      />
    </div>

    <div ref="element" class="w-full b b-app rd max-h-128 overflow-y-auto">
      <!-- @vue-expect-error: false-positive, generics are matching -->
      <BaseTable
        v-bind="props"
        class="w-full"
        class-header-row="sticky top-0 bg-subtle z-10"
        class-header-cell="font-medium first:pl-lg px-md last:pr-lg py-sm text-sm text-start"
        class-cell="first:pl-lg px-md last:pr-lg py-sm text-sm text-start last:text-end"
        class-row="b-t b-app hover:bg-subtle">

        <!-- Passthrough slots -->
        <template v-for="(_, name) in slots" #[name]="slot">
          <slot :name="name" v-bind="slot" />
        </template>
      </BaseTable>
    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  searchPlaceholder: Search
fr:
  searchPlaceholder: Rechercher
de:
  searchPlaceholder: Suchen
es:
  searchPlaceholder: Buscar
zh:
  searchPlaceholder: 搜索
</i18n>
