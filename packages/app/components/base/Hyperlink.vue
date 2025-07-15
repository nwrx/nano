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
</script>

<template>
  <BaseButton v-bind="props" class="hyperlink space-x-xs text-start relative group">

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
        'translate-x-0 group-hover:translate-x-1': iconExpand,
        'rotate-0 group-hover:rotate-180': iconFlip,
      }"
    />

    <!-- Underline -->
    <span
      class="
        absolute h-px w-full bg-current bottom-0 left-0
        transform scale-x-0 group-hover:scale-x-100
        transition-transform duration-fast !m-0
      "
    />
  </BaseButton>
</template>
