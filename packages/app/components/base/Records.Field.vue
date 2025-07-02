<script setup lang="ts">
defineProps<{
  label?: string
  value?: number | string
}>()

defineSlots<{
  label?: []
  value?: []
}>()
</script>

<template>
  <div class="flex items-start space-x-sm w-full">

    <!-- Label -->
    <span class="text-sm text-subtle">
      <slot name="label">
        {{ label }}:
      </slot>
    </span>

    <!-- Value -->
    <span class="text-sm text-app font-medium">
      <slot name="value">
        {{ value }}
      </slot>
    </span>
  </div>
</template>
