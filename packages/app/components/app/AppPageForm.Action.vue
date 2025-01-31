<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<{
  title: string
  text: string
  variant: Variant
} & BaseButtonProps>()

const emit = defineEmits<{
  click: []
}>()

const classes = computed(() => ({
  'border-danger-200': props.variant === 'danger',
  'border-primary-200': props.variant === 'primary',
  'border-success-200': props.variant === 'success',
  'border-warning-200': props.variant === 'warning',
  'border-black/10': !props.variant,
}))
</script>

<template>
  <div
    class="flex items-center space-x-4 border-t first:border-t-0 p-4"
    :class="classes">

    <!-- Description -->
    <div class="grow">
      <h3 class="text-base font-medium">
        <slot name="title">{{ title }}</slot>
      </h3>
      <p class="text-sm">
        <slot name="text">{{ text }}</slot>
      </p>
    </div>

    <!-- CTA -->
    <Button
      filled
      size="sm"
      :label="label"
      :variant
      class="shrink-0"
      @click="() => emit('click')"
    />
  </div>
</template>
