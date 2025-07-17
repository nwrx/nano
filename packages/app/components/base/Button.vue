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
  <BaseButton
    v-slot="slots"
    v-bind="props"
    class="button hover:button-hover space-x-xs group">

    <!-- Loading -->
    <BaseIcon
      v-if="slots.isLoading && (iconPrepend || icon)"
      icon="i-line-md:loading-loop"
    />

    <!-- Prepend -->
    <BaseIcon
      v-else-if="iconPrepend || icon"
      :icon="iconPrepend || icon"
      :load="iconLoad"
    />

    <!-- Content -->
    <slot v-if="label || $slots.default">
      <span>
        {{ label }}
      </span>
    </slot>

    <!-- Loading -->
    <BaseIcon
      v-if="slots.isLoading && (iconAppend && !iconPrepend && !icon)"
      icon="i-line-md:loading-loop"
    />

    <!-- Append -->
    <BaseIcon
      v-else-if="iconAppend"
      :icon="iconAppend"
      :load="iconLoad"
      class="transform transition-transform"
      :class="{
        'translate-x-0 group-hover:translate-x-1': iconExpand,
        'rotate-0 group-hover:rotate-180': iconFlip,
      }"
    />
  </BaseButton>
</template>
