<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<BaseButtonProps & {
  label?: number | string
  icon?: string
  iconLoad?: boolean
  iconAppend?: string
  iconPrepend?: string
  iconExpand?: boolean
  iconFlip?: boolean
}>()

const isHovered = ref(false)
</script>

<template>
  <BaseButton
    v-bind="props"
    class="hyperlink space-x-xs text-start relative hover:hyperlink-hover"
    @mouseover="() => isHovered = true"
    @mouseleave="() => isHovered = false">

    <!-- Prepend -->
    <BaseIcon
      v-if="iconPrepend || icon"
      :icon="iconPrepend || icon"
      :load="iconLoad"
      class="size-4 mr-xs"
    />

    <!-- Content -->
    <slot v-if="label || $slots.default">
      <div>
        <span>{{ label }}</span>
      </div>
    </slot>

    <!-- Append -->
    <BaseIcon
      v-if="iconAppend"
      :icon="iconAppend"
      :load="iconLoad"
      class="transform transition-transform"
      :class="{
        'translate-x-0': iconExpand && !isHovered,
        'translate-x-1': isHovered && !iconExpand,
        'rotate-180': isHovered && iconFlip,
        'rotate-0': iconFlip && !isHovered,
      }"
    />

    <!-- Underline -->
    <span
      class="
        absolute h-px w-full bg-current bottom-0 left-0
        transform transition-transform duration-fast !m-0
      "
      :class="{
        'scale-x-100': isHovered,
        'scale-x-0': !isHovered,
      }"
    />
  </BaseButton>
</template>
