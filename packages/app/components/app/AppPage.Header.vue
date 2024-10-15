<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description: string
  badge?: string
  badgeVariant?: Variant
}>()
</script>

<template>
  <div class="w-full p-lg pb-0">
    <div
      class="
        flex flex-col justify-start w-full p-lg h-48
        bg-layout text-layout rounded
      ">

      <!-- Title -->
      <div class="flex items-center gap-md self-start">
        <div class="bg-prominent rounded p-sm">
          <BaseIcon v-if="icon" :icon="icon" class="text-prominent size-5"/>
        </div>
        <span class="text-4xl font-medium ">
          {{ title }}
        </span>
      </div>

      <!-- Breadcrumb -->
      <RouterLink to="/" class="flex items-center gap-sm self-end mt-auto">
        <BaseIcon icon="i-carbon:chevron-right" class="size-4"/>
        <span>{{ title }}</span>
      </RouterLink>
    </div>
  </div>
</template>
