<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts" generic="T extends object">
const props = defineProps<{
  initialValue: T
}>()

interface SlotProps {
  value: T
  reset: () => void
}

defineSlots<{
  default: (slot: SlotProps) => VNode
}>()

const value = ref(props.initialValue)
const reset = () => value.value = props.initialValue
const slot = { value: value.value, reset }
</script>

<template>
  <slot v-bind="slot" />
</template>
