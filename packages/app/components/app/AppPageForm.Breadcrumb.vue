<script setup lang="ts">
import type { RouteRecord } from 'vue-router'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import Hyperlink from '../base/Hyperlink.vue'

const props = defineProps<{
  items: string[]
}>()

const currentRoute = useRoute()
const router = useRouter()
const routes = computed(() => {
  if (!props.items) return []
  const allRoutes = router.getRoutes()
  return props.items
    .map(item => allRoutes.find(route => route.name === item))
    .filter(Boolean)
}) as Ref<RouteRecord[]>
</script>

<template>
  <div class="flex items-center space-x-md w-full bg-subtle px-lg sm:px-2xl py-xs sm:py-md b-b b-app">
    <template v-for="(route, index) in routes" :key="index">

      <!-- Route link -->
      <Hyperlink
        :icon="route.meta.icon"
        :to="route"
        class="text-app">
        {{ localize(route.meta.title) }}
      </Hyperlink>

      <!-- Separator -->
      <BaseIcon
        icon="i-carbon:chevron-right"
        class="mx-xs"
      />
    </template>

    <!-- Current page -->
    <span class="text-app font-semibold">
      {{ localize(currentRoute.meta.title) }}
    </span>
  </div>
</template>
