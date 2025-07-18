<script setup lang="ts">
const props = defineProps<{
  label?: string
  value?: number | string
  defaultValue?: number | string
}>()

defineSlots<{
  label?: []
  value?: []
  defaultValue?: []
}>()

const isEmpty = computed(() =>
  props.value === undefined
  || props.value === null
  || props.value === ''
  || (typeof props.value === 'number' && Number.isNaN(props.value)),
)
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
    <span v-if="!isEmpty" class="text-sm text-app font-medium">
      <slot name="value">
        {{ value }}
      </slot>
    </span>

    <span v-else class="text-sm text-subtle italic">
      <slot name="defaultValue">
        {{ defaultValue }}
      </slot>
    </span>
  </div>
</template>
