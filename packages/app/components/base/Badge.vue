<script setup lang="ts">
const props = defineProps<{
  icon?: string
  iconAppend?: string
  iconPrepend?: string
  label?: string
  filled?: boolean
  outlined?: boolean
  variant?: Variant
  size?: Size
}>()

const classes = computed(() => {
  const {
    filled,
    outlined,
    size = 'medium',
    variant = 'light',
  } = props

  const classesBase = {
    'rounded': true,
    'h-6 space-x-1 text-xs px-1 py-0.5': size === 'xsmall',
    'h-7 space-x-2 text-sm px-2 py-1': size === 'small',
    'h-8 space-x-3 text-base px-3 py-1': size === 'medium',
    'h-9 space-x-4 text-lg px-4 py-1': size === 'large',
    'h-10 space-x-4 text-xl px-4 py-2': size === 'xlarge',
  }

  const classesLight = {
    'text-primary-500 bg-primary-100': variant === 'primary',
    'text-secondary-500 bg-secondary-50': variant === 'secondary',
    'text-success-500 bg-success-50': variant === 'success',
    'text-danger-500 bg-danger-50': variant === 'danger',
    'text-warning-500 bg-warning-50': variant === 'warning',
    'text-accent-800 bg-accent-100': variant === 'accent',
    'text-black bg-light': variant === 'light',
  }

  const classesOutlined = {
    'ring-1': true,
    'ring-primary-500 text-primary-500': variant === 'primary',
    'ring-secondary-500 text-secondary-500': variant === 'secondary',
    'ring-success-500 text-success-500': variant === 'success',
    'ring-danger-500 text-danger-500': variant === 'danger',
    'ring-warning-500 text-warning-500': variant === 'warning',
    'ring-accent-500 text-accent-500': variant === 'accent',
    'ring-black text-black': variant === 'light',
  }

  const classesOutlinedDark = {
    'dark:ring-primary-100 dark:text-primary-100': variant === 'primary',
    'dark:ring-secondary-100 dark:text-secondary-100': variant === 'secondary',
    'dark:ring-success-100 dark:text-success-100': variant === 'success',
    'dark:ring-danger-100 dark:text-danger-100': variant === 'danger',
    'dark:ring-warning-100 dark:text-warning-100': variant === 'warning',
    'dark:ring-accent-100 dark:text-accent-100': variant === 'accent',
    'dark:ring-white dark:text-white': variant === 'light',
  }

  const classesFilled = {
    'text-white': true,
    'bg-primary-500': variant === 'primary',
    'bg-secondary-500': variant === 'secondary',
    'bg-success-500': variant === 'success',
    'bg-danger-500': variant === 'danger',
    'bg-warning-500': variant === 'warning',
    'bg-accent-500': variant === 'accent',
    'bg-light-500': variant === 'light',
  }

  if (filled) return { ...classesBase, ...classesFilled }
  if (outlined) return { ...classesBase, ...classesOutlined, ...classesOutlinedDark }
  return { ...classesBase, ...classesLight }
})

const iconClasses = computed(() => {
  const { size = 'medium' } = props
  return {
    'w-3 h-3': size === 'xsmall',
    'w-4 h-4': size === 'small',
    'w-5 h-5': size === 'medium',
    'w-6 h-6': size === 'large',
    'w-7 h-7': size === 'xlarge',
  }
})
</script>

<template>
  <BaseBadge
    class="inline-flex items-center block px-2 py-1 font-medium"
    :class="classes">

    <!-- Icon -->
    <BaseIcon
      v-if="iconPrepend || icon"
      as="i"
      :icon="iconPrepend || icon"
      :class="iconClasses"
      load
    />

    <!-- Content -->
    <slot>
      <span v-if="label" v-text="label" />
    </slot>

    <!-- Icon -->
    <BaseIcon
      v-if="iconAppend"
      as="i"
      :icon="iconAppend"
      :class="iconClasses"
      load
    />
  </BaseBadge>
</template>
