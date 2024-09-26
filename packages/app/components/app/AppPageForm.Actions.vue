<script setup lang="ts">
const props = defineProps<{
  variant: Variant
}>()

const classes = computed(() => ({
  'border-danger-500': props.variant === 'danger',
  'border-primary-500': props.variant === 'primary',
  'border-success-500': props.variant === 'success',
  'border-warning-500': props.variant === 'warning',
  'border-black/10': !props.variant,
}))
</script>

<template>
  <div class="flex flex-col w-full border rounded" :class="classes">
    <slot/>
  </div>
</template>
