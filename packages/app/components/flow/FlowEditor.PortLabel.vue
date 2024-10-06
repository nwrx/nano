<script setup lang="ts">
defineProps<{
  label: string
  icon?: string
  light?: boolean
  primary?: boolean
  outlined?: boolean
}>()
</script>

<template>
  <span
    :class="{
      'bg-primary-500 ring-white text-white': primary,
      'bg-primary-100 ring-primary-500 text-primary-500': light,
      'text-black/50 ring-black/10 italic': !light && !primary,
      'ring-1': outlined,
    }"
    class="
      flex items-center space-x-2 h-6 px-2 rounded text-sm
      transition-colors duration-200
      bg-opacity-90 hover:bg-opacity-100
      text-opacity-80 hover:text-opacity-100
    ">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="w-4 h-4"
    />

    <!-- Label -->
    <span class="whitespace-nowrap truncate">
      {{ label }}{{ !light && !primary ? ':' : '' }}
    </span>
  </span>
</template>
