<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
  maintainer: string
  rating: number
  ratingCount: number
  isCurated?: boolean
  isOfficial?: boolean
  categories?: string[]
}>()
</script>

<template>
  <div
    class="
      flex flex-col
      p-md bg-subtle rd
      b b-app hover:b-prominent cursor-pointer
    ">

    <!-- Icon -->
    <div class="flex items-center gap-sm">
      <BaseIcon :icon="icon" class="size-8 rd" />

      <!-- Title -->
      <h3>
        <p class="flex items-center space-x-sm">
          <span class="text-lg font-medium">{{ title }}</span>
          <BaseIcon v-if="isCurated" icon="i-carbon:favorite-filled" class="size-4 text-red" />
          <BaseIcon v-if="isOfficial" icon="i-carbon:checkmark-filled" class="size-4 text-green" />
        </p>

        <!-- Maintainer -->
        <p class="text-xs text-subtle">{{ maintainer }}</p>
      </h3>

      <!-- Actions -->
      <div class="flex-grow" />

      <Button
        outlined
        size="sm"
        icon="i-carbon:add"
        label="Add"
      />
    </div>

    <!-- Description -->
    <p class="text-sm text-subtle mt-md">{{ description }}</p>

    <!-- Categories -->
    <div class="flex items-center gap-xs text-subtle mt-auto pt-md">
      <span v-for="category in categories" :key="category" class="text-xs">{{ category }}</span>
    </div>

    <!-- Rating -->
    <div class="flex items-center gap-xs text-subtle">
      <BaseIcon icon="i-carbon:star" class="size-4" />
      <span class="text-xs">{{ rating }} ({{ ratingCount }})</span>
    </div>
  </div>
</template>
