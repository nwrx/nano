<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
const props = defineProps<{
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  color: string
}>()

const offset = computed(() => {
  const x = props.targetX - props.sourceX
  const y = props.targetY - props.sourceY
  const lineLength = Math.hypot(x, y)
  return Math.max(30, lineLength / 2)
})

const d = computed(() => [
  'M',
  props.sourceX,
  props.sourceY,
  'C',
  props.sourceX + offset.value,
  props.sourceY,
  props.targetX - offset.value,
  props.targetY,
  props.targetX,
  props.targetY,
].join(' '))
</script>

<template>
  <svg class="w-full h-full pointer-events-none absolute left-0 top-0">
    <path
      :d="d"
      :stroke="color"
      stroke-width="4"
      fill="transparent"
    />
  </svg>
</template>
