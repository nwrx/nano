<script setup lang="ts">
import type { RouteRecordNormalized } from 'vue-router'

const props = defineProps<{
  name?: NavItemGroup
  label?: string
  items?: RouteRecordNormalized[]
}>()

const router = useRouter()
const routes = computed(() => {
  if (props.items) return props.items
  if (!props.name) return [] as RouteRecordNormalized[]
  return router.getRoutes().filter(x => x.meta.group === props.name)
})
</script>

<template>
  <div class="flex flex-col py-sm first:pt-0 last:pb-0">

    <!-- Label -->
    <div v-if="label" class="text-xs text-subtle uppercase mb-sm ml-md">
      {{ label }}
    </div>

    <!-- Items -->
    <div class="flex flex-col">
      <slot>
        <AppPageNavItem
          v-for="route in routes"
          :key="route.name"
          :icon="route.meta.icon"
          :label="localize(route.meta.title)"
          :to="{ name: route.name }"
        />
      </slot>
    </div>
  </div>
</template>
