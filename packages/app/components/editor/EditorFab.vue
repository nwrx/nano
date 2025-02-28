<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<BaseButtonProps & {
  icon?: string
  label?: string
  isActive?: boolean
}>()
</script>

<template>
  <BaseButton
    v-bind="props"
    eager
    :class="{ 'text-white !bg-primary-500': isActive }"
    class="flex items-center justify-center size-8 rounded hover:bg-prominent transition">

    <slot>
      <BaseIcon
        v-if="icon"
        :icon="icon"
        class="size-5 shrink-0"
      />
    </slot>
  </BaseButton>
</template>
