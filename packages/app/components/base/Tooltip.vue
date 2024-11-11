<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  message: string
  position?: 'bottom' | 'left' | 'right' | 'top'
  size?: 'lg' | 'md' | 'sm'
  variant?: 'danger' | 'primary' | 'success' | 'warning'
  disabled?: boolean
  persistent?: boolean
}>()

const disabled = computed(() => props.disabled ?? false)
const persistent = computed(() => props.persistent ?? false)
const isVisible = ref(false)

const position = computed(() => {
  const { position = 'bottom' } = props
  return {
    'tooltip': true,
    'tooltip-top': position === 'top',
    'tooltip-bottom': position === 'bottom',
    'tooltip-left': position === 'left',
    'tooltip-right': position === 'right',
  }
})

const widthSize = computed(() => {
  const { size = 'md' } = props
  return {
    'w-60': size === 'lg',
    'w-40': size === 'md',
    'w-20': size === 'sm',
  }
})

const color = computed(() => {
  const { variant = 'primary' } = props
  return {
    'bg-primary-500 dark:text-primary-100 text-white': variant === 'primary',
    'dark:bg-secondary-600 bg-secondary-500': variant === 'warning',
    'dark:bg-success-800 bg-success-500': variant === 'success',
    'dark:bg-danger-800 bg-danger-500': variant === 'danger',
  }
})
</script>

<template>
  <div
    class="tooltiped"
    @mouseenter="() => isVisible = true"
    @mouseleave="() => isVisible = false"
    @click="() => isVisible = false">
    <slot></slot>
    <div class="relative">
      <Transition>
        <div v-if="isVisible && !disabled || persistent && !disabled" class="tooltip absolute inline-block z-10 p-1 m-2 rounded-xl text-align-center font-size-4" :class="[position, color, widthSize]">
          <span>{{ message }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
.tooltip {
  opacity: v-bind('persistent ? 1 : 0');
  transition: opacity 0.2s ease-in-out !important;
}
.tooltip-top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
}
.tooltip-bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}
.tooltip-left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
}
.tooltip-right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
}
.tooltiped:hover .tooltip {
  opacity: 1;
}
</style>
