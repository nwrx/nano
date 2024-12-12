<script setup lang="ts">
import type { MaybeArray } from '@unshared/types'

defineProps<{
  icon?: string
  title: MaybeArray<string>
  description: string
  badge?: string
  badgeVariant?: Variant
}>()
</script>

<template>
  <div
    class="
      sticky top-0 w-full z-1 b-b b-app
      flex justify-between w-full px-lg h-24
      text-app shrink-0 bg-app
    ">

    <!-- Title -->
    <div class="flex items-center gap-md self-center">

      <!-- Icon -->
      <div v-if="icon" class="bg-prominent rounded p-sm mr-md">
        <BaseIcon :icon="icon" class="text-prominent size-8" />
      </div>

      <!-- Multiple Titles -->
      <template v-if="Array.isArray(title)">
        <div v-for="(x, index) in title" :key="x" class="flex items-center space-x-sm">
          <BaseIcon v-if="index > 0" icon="i-carbon:chevron-right" class="size-6 mr-sm" />
          <span class="text-4xl font-medium">{{ x }}</span>
        </div>
      </template>

      <!-- Single Title -->
      <span v-else class="text-4xl font-medium ">
        {{ title }}
      </span>
    </div>

    <!-- Tabs -->
    <div class="flex items-center justify-end gap-md mt-auto">
      <slot />
    </div>
  </div>
</template>
