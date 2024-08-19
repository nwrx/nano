<script setup lang="ts">
import type { CardProps } from '~/utils/types'

const props = defineProps<CardProps>()
const classes = computed(() => {
  const {
    variant,
    rounded = false,
    gradient = false,
    centered = false,
    outlined = false,
  } = props

  const baseClasses = {
    'p-8 space-y-4': true,
    'rounded': !rounded,
    'rounded-lg': rounded,
    'text-center': centered,
    'dark:text-white text-black': true,
    'dark:bg-primary-800 bg-primary-50': variant === 'primary',
    'dark:bg-secondary-800 bg-secondary-50': variant === 'secondary',
    'dark:bg-success-800 bg-success-50': variant === 'success',
    'dark:bg-danger-800 bg-danger-50': variant === 'danger',
    'dark:bg-warning-800 bg-warning-50': variant === 'warning',
    'dark:bg-accent-800 bg-accent-50': variant === 'accent',
    'dark:bg-dark-800 bg-light-500': variant === 'light',
  }

  const outlinedClasses = {
    'ring-1': true,
    'ring-primary-100': variant === 'primary',
    'ring-secondary-100': variant === 'secondary',
    'ring-success-100': variant === 'success',
    'ring-danger-100': variant === 'danger',
    'ring-warning-100': variant === 'warning',
    'ring-accent-100': variant === 'accent',
    'ring-black': variant === 'light',
  }

  const outlinedClassesDark = {
    'dark:ring-primary-800': variant === 'primary',
    'dark:ring-secondary-800': variant === 'secondary',
    'dark:ring-success-800': variant === 'success',
    'dark:ring-danger-800': variant === 'danger',
    'dark:ring-warning-800': variant === 'warning',
    'dark:ring-accent-800': variant === 'accent',
    'dark:ring-white': variant === 'light',
  }

  const gradientClasses = {
    'bg-gradient-to-br': true,
    'from-primary-100 via-primary-50 to-accent-100': variant === 'primary',
    'from-secondary-100 via-secondary-50 to-accent-100': variant === 'secondary',
    'from-success-100 via-success-50 to-accent-100': variant === 'success',
    'from-danger-100 via-danger-50 to-accent-100': variant === 'danger',
    'from-warning-100 via-warning-50 to-accent-100': variant === 'warning',
    'from-accent-100 via-accent-50 to-primary-50': variant === 'accent',
  }

  const gradientClassesDark = {
    'dark:from-primary-700 dark:via-primary-600 dark:to-accent-600': variant === 'primary',
    'dark:from-secondary-700 dark:via-secondary-600 dark:to-accent-600': variant === 'secondary',
    'dark:from-success-700 dark:via-success-600 dark:to-accent-600': variant === 'success',
    'dark:from-danger-700 dark:via-danger-600 dark:to-accent-600': variant === 'danger',
    'dark:from-warning-700 dark:via-warning-600 dark:to-accent-600': variant === 'warning',
    'dark:from-accent-700 dark:via-accent-600 dark:to-primary-600': variant === 'accent',
    'dark:from-dark-700 dark:via-dark-600 dark:to-accent-600': variant === 'light',
  }

  return {
    ...baseClasses,
    ...outlined ? { ...outlinedClasses, ...outlinedClassesDark } : {},
    ...gradient ? { ...gradientClasses, ...gradientClassesDark } : {},
  }
})
</script>

<template>
  <component :is="as ?? 'div'" :class="[{ dark }]" class="w-full">
    <div :class="[classes, classContainer]">
      <slot/>
    </div>
  </component>
</template>
