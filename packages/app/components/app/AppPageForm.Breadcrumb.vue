<script setup lang="ts">
import type { RouteRecord } from 'vue-router'

const props = defineProps<{
  items: string[]
}>()

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
      <Hyperlink :to="route" class="text-app">
        {{ localize(route.meta.title) }}
      </Hyperlink>

      <!-- Separator -->
      <BaseIcon
        v-if="index < items.length - 1"
        icon="i-carbon:chevron-right"
        class="mx-xs"
      />
    </template>
  </div>
</template>
