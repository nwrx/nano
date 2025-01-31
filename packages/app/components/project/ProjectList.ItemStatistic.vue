<script setup lang="ts">
defineProps<{
  name: string
  value: string
  unit?: string
  trend?: 'down' | 'up'
}>()
</script>

<template>
  <div class="flex items-start justify-center w-28">

    <!-- Trend -->
    <BaseIcon
      v-if="trend"
      :icon="trend === 'down' ? 'i-carbon:arrow-down' : 'i-carbon:arrow-up'"
      :class="trend === 'down' ? 'text-danger-500' : 'text-success-500'"
      class="w-5 h-5"
    />

    <!-- Value -->
    <div class="flex flex-col items-start justify-center ">
      <h4 class="flex items-end whitespace-nowrap space-x-0.5">
        <span class="text-base font-medium">{{ value }}</span>
        <span class="text-xs text-black/50 mb-1">{{ unit }}</span>
      </h4>

      <!-- Name -->
      <p class="text-xs text-black/50">
        {{ name }}
      </p>

    </div>
  </div>
</template>
