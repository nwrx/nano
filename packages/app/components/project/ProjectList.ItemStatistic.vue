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
      class="size-6"
    />

    <!-- Value -->
    <div class="flex flex-col items-start justify-center ">
      <h4 class="flex items-end whitespace-nowrap space-x-sm">
        <p class="text-lg font-medium">
          {{ value }}
        </p>
        <p class="text-sm text-subtle mb-1">
          {{ unit }}
        </p>
      </h4>

      <!-- Name -->
      <p class="text-sm text-subtle">
        {{ name }}
      </p>

    </div>
  </div>
</template>
