<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'

const props = defineProps<BaseButtonProps & {
  icon?: string
  label?: string
  isActive?: boolean
  classIcon?: unknown
}>()
</script>

<template>
  <BaseButton
    v-bind="props"
    eager
    :class="{ 'text-active !bg-active': isActive }"
    class="flex items-center justify-center size-8 rounded hover:bg-prominent transition">

    <slot>
      <BaseIcon
        v-if="icon"
        :icon="icon"
        class="size-5 shrink-0 transition"
        :class="classIcon"
      />
    </slot>
  </BaseButton>
</template>
