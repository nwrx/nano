<script setup lang="ts">
defineProps<{
  label: string
  icon?: string
}>()
</script>

<template>
  <div class="flex items-center space-x-sm h-full pl-sm text-sm text-subtle">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="size-4"
    />

    <!-- Label -->
    <p class="whitespace-nowrap truncate">
      {{ label }}:
    </p>
  </div>
</template>
