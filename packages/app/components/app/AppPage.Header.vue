<script setup lang="ts">
import type { MaybeArray } from '@unshared/types'

defineProps<{
  icon?: string
  title: MaybeArray<string | undefined>
  description: string
}>()

const slots = defineSlots<{
  default: []
  menu: []
}>()
</script>

<template>
  <div
    class="
      sticky top-0 w-full z-1 b-b b-app
      flex flex-col justify-between w-full
      text-app shrink-0
    ">

    <!-- Title -->
    <div class="flex items-center gap-md self-start p-lg w-full bg-subtle">

      <!-- Icon -->
      <div v-if="icon" class="bg-prominent rounded p-sm mr-md b b-app">
        <BaseIcon :icon="icon" class="text-prominent size-8" />
      </div>

      <!-- Multiple Titles -->
      <template v-if="Array.isArray(title)">
        <div v-for="(x, index) in title.filter(Boolean)" :key="x" class="flex items-center space-x-sm">
          <BaseIcon v-if="index > 0" icon="i-carbon:chevron-right" class="size-6 mr-sm" />
          <span class="text-4xl font-medium">{{ x }}</span>
        </div>
      </template>

      <!-- Single Title -->
      <span v-else class="text-4xl font-medium ">
        {{ title }}
      </span>

      <!-- Menu -->
      <div v-if="slots.menu" class="ml-auto">
        <slot name="menu" />
      </div>
    </div>

    <!-- Tabs -->
    <div
      v-if="slots.default"
      class="flex items-center justify-end b-t b-app">
      <slot />
    </div>
  </div>
</template>
