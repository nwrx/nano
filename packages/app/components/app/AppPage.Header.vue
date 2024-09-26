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
  <div
    class="
    flex items-center justify-between w-full px-8 md:px-16 py-16 relative
    bg-gradient-to-b from-primary-100 to-transparent
  ">

    <!-- Title -->
    <div class="flex flex-col">
      <p class="text-3xl font-medium flex items-center gap-2">
        <BaseIcon v-if="icon" :icon="icon" />
        <span>{{ title }}</span>
        <Badge v-if="badge" :label="badge" size="medium" :variant="badgeVariant" filled/>
      </p>

      <!-- Description -->
      <p class="text-sm opacity-60">
        {{ description }}
      </p>
    </div>
  </div>
</template>
