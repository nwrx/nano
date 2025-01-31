<script setup lang="ts">
import { vMarkdown } from '#imports'

const props = defineProps<{
  title?: string
  text?: string
  icon?: string
  variant?: Variant
}>()

const classes = computed(() => {
  const { variant } = props
  return {

    // --- Light mode
    'bg-light border-black/10 text-black': variant === undefined,
    'bg-primary-50 border-primary-100 text-primary-700': variant === 'primary',
    'bg-success-50 border-success-200 text-success-700': variant === 'success',
    'bg-warning-50 border-warning-200 text-warning-700': variant === 'warning',
    'bg-danger-50 border-danger-200 text-danger-700': variant === 'danger',

    // --- Dark mode
    'dark:bg-transparent dark:border-black/10 dark:text-white': variant === undefined,
    'dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300': variant === 'primary',
    'dark:bg-success-900/30 dark:border-success-700 dark:text-success-300': variant === 'success',
    'dark:bg-warning-900/30 dark:border-warning-700 dark:text-warning-300': variant === 'warning',
    'dark:bg-danger-900/30 dark:border-danger-700 dark:text-danger-300': variant === 'danger',
  }
})
</script>

<template>
  <div class="p-4 border-y" :class="classes">

    <!-- Icon -->
    <div class="flex space-x-2">
      <BaseIcon
        v-if="icon"
        :icon="icon"
        class="w-4 h-4 shrink-0 mt-1 opacity-60"
      />

      <!-- Content -->
      <slot>
        <p v-markdown="text" class="text-sm"/>
      </slot>
    </div>
  </div>
</template>
