<!-- eslint-disable unicorn/explicit-length-check -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<{
  icon?: string
  iconAppend?: string
  iconPrepend?: string
  iconExpand?: boolean

  // --- Styling.
  link?: boolean
  light?: boolean
  filled?: boolean
  rounded?: boolean
  rainbow?: boolean
  outlined?: boolean
  size?: '2xl' | 'lg' | 'md' | 'sm' | 'xl'
  variant?: Variant
} & BaseButtonProps>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const slots = defineSlots<{
  default: () => VNode
}>()

const classes = computed(() => {
  const {
    size = 'md',
    link = false,
    light = false,
    filled = false,
    rounded = false,
    rainbow = false,
    outlined = false,
    variant = 'light',
  } = props

  const classesBase = {
    'rounded': !rounded,
    'rounded-full': rounded,
    'gap-x-1 text-sm': size === 'sm',
    'gap-x-2 text-base': size === 'md',
    'gap-x-3 text-base md:text-lg': size === 'lg',
    'gap-x-4 text-lg md:text-xl': size === 'xl',
    'gap-x-5 text-xl md:text-2xl': size === '2xl',
    'px-3 py-2 md:px-3 md:py-2': !link && size === 'sm',
    'px-3 py-2 md:px-4 md:py-2': !link && size === 'md',
    'px-3 py-2 md:px-4 md:py-3': !link && size === 'lg',
    'px-3 py-2 md:px-5 md:py-3': !link && size === 'xl',
    'px-7 py-5 md:px-8 md:py-6': !link && size === '2xl',
    'opacity-80 hover:opacity-100 outline-none': true,
  }

  const classesLink = {
    'hover:saturate-150': true,
    'text-primary-700': variant === 'primary',
    'text-secondary-700': variant === 'secondary',
    'text-success-700': variant === 'success',
    'text-danger-700': variant === 'danger',
    'text-warning-700': variant === 'warning',
    'text-accent-700': variant === 'accent',
    'text-black': variant === 'light',
  }

  const classesLinkDark = {
    'dark:text-primary-50': variant === 'primary',
    'dark:text-secondary-50': variant === 'secondary',
    'dark:text-success-50': variant === 'success',
    'dark:text-danger-50': variant === 'danger',
    'dark:text-warning-50': variant === 'warning',
    'dark:text-accent-50': variant === 'accent',
    'dark:text-light-50': variant === 'light',
  }

  const classesLight = {
    'ring-0 focus:ring-2 focus:ring-offset-2 hover:ring-offset-0 hover:ring-2': true,
    'ring-primary-700 text-primary-700 bg-primary-50': variant === 'primary',
    'ring-secondary-700 text-secondary-700 bg-secondary-50': variant === 'secondary',
    'ring-success-700 text-success-700 bg-success-50': variant === 'success',
    'ring-danger-700 text-danger-700 bg-danger-50': variant === 'danger',
    'ring-warning-700 text-warning-700 bg-warning-50': variant === 'warning',
    'ring-accent-700 text-accent-700 bg-accent-50': variant === 'accent',
    'text-black bg-light-50': variant === 'light',
  }

  const classesOutlined = {
    'ring-1 active:ring-offset-0 hover:ring-offset-2 hover:ring-2 backdrop-blur-md': true,
    'ring-primary-500 text-primary-500': variant === 'primary',
    'ring-secondary-500 text-secondary-500': variant === 'secondary',
    'ring-success-500 text-success-500': variant === 'success',
    'ring-danger-500 text-danger-500': variant === 'danger',
    'ring-warning-500 text-warning-500': variant === 'warning',
    'ring-accent-500 text-accent-500': variant === 'accent',
    'ring-black text-black': variant === 'light',
  }

  const classesOutlineDark = {
    'dark:ring-primary-800 dark:text-primary-100': variant === 'primary',
    'dark:ring-secondary-800 dark:text-secondary-100': variant === 'secondary',
    'dark:ring-success-800 dark:text-success-100': variant === 'success',
    'dark:ring-danger-800 dark:text-danger-100': variant === 'danger',
    'dark:ring-warning-800 dark:text-warning-100': variant === 'warning',
    'dark:ring-accent-800 dark:text-accent-100': variant === 'accent',
    'dark:ring-light-800 dark:text-light-100': variant === 'light',
  }

  const classesFilled = {
    'ring-0 focus:ring-2 focus:ring-offset-2 hover:ring-offset-0 hover:ring-2': true,
    'text-white ring-primary-500 bg-primary-500': variant === 'primary',
    'text-white ring-secondary-500 bg-secondary-500': variant === 'secondary',
    'text-white ring-success-500 bg-success-500': variant === 'success',
    'text-white ring-danger-500 bg-danger-500': variant === 'danger',
    'text-white ring-warning-500 bg-warning-500': variant === 'warning',
    'text-white ring-accent-500 bg-accent-500': variant === 'accent',
    'text-black ring-light-500 bg-light-500': variant === 'light',
  }

  const classRainbow = {
    'bg-gradient-to-br from-secondary-500 via-primary-500 to-accent-500 text-white': true,
    'hover:saturate-150 hover:scale-105 bg-[size:200%] hover:bg-[size:100%]': true,
  }

  return {
    ...classesBase,
    ...link ? { ...classesLink, ...classesLinkDark } : {},
    ...light ? classesLight : {},
    ...filled ? classesFilled : {},
    ...outlined ? { ...classesOutlined, ...classesOutlineDark } : {},
    ...rainbow ? classRainbow : {},
  }
})

const iconClasses = computed(() => {
  const { size = 'md', iconExpand } = props
  return {
    'w-4 h-4': size === 'sm',
    'w-5 h-5': size === 'md',
    'w-6 h-6': size === 'lg',
    'w-7 h-7': size === 'xl',
    'transition-transform duration-200 ease-out': true,
    'group-hover:last:translate-x-1': iconExpand,
  }
})

const barClasses = computed(() => {
  const { variant = 'light' } = props
  return {
    'dark:bg-primary-100 bg-primary-500': variant === 'primary',
    'dark:bg-secondary-100 bg-secondary-500': variant === 'secondary',
    'dark:bg-success-100 bg-success-500': variant === 'success',
    'dark:bg-danger-100 bg-danger-500': variant === 'danger',
    'dark:bg-warning-100 bg-warning-500': variant === 'warning',
    'dark:bg-accent-100 bg-accent-500': variant === 'accent',
    'dark:bg-light-100 bg-black': variant === 'light',
  }
})
</script>

<template>
  <BaseButton
    v-slot="slotProps"
    class="
      inline-flex items-center justify-center focus:outline-none
      transition-all duration-100 ease-out relative group
    "
    :class="classes"
    v-bind="props">

    <!-- Icon -->
    <BaseIcon
      v-if="iconPrepend || icon"
      as="i"
      :icon="iconPrepend || icon"
      :class="iconClasses"
      load
    />

    <!-- Content -->
    <slot v-bind="slotProps">
      <span v-if="label" v-text="label" />
    </slot>

    <!-- Bottom bar -->
    <div
      v-if="link"
      :class="barClasses"
      class="
        absolute -bottom-px left-0 h-px rounded-full
        translate-x-1/2
        w-1 opacity-0
        group-hover:w-full
        group-hover:opacity-100
        group-hover:translate-x-0
        transition-all duration-100 ease-out
      "
    />

    <!-- Icon -->
    <BaseIcon
      v-if="iconAppend || slotProps.isLoading"
      as="i"
      :icon="slotProps.isLoading ? 'i-line-md:loading-loop' : iconAppend"
      :class="iconClasses"
      load
    />
  </BaseButton>
</template>
