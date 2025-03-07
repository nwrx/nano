<script setup lang="ts" generic="T extends string">
import type { VNode } from 'vue'
defineProps<{ keys: T[] }>()

const value = reactive({}) as Record<T, boolean | undefined>
const open = (key: T) => value[key] = true
const close = (key: T) => value[key] = false

interface SlotProps {
  open: (key: T) => void
  close: (key: T) => void
  value: Record<T, boolean | undefined>
}

defineSlots<{
  default: (slot: SlotProps) => VNode
}>()
</script>

<template>
  <slot v-bind="{ open, close, value } as SlotProps" />
</template>
