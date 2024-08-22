<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { FlowLinkProps } from '~/utils/types'

const props = defineProps<FlowLinkProps>()

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
  <svg class="w-full h-full pointer-events-none">
    <defs>
      <linearGradient id="line-gradient" x1="0" x2="1" y1="0" y2="0">
        <stop :stop-color="sourceColor" offset="0" />
        <stop :stop-color="targetColor" offset="1" />
      </linearGradient>
    </defs>
    <path
      :d="d"
      stroke="url(#line-gradient)"
      stroke-width="4"
      fill="transparent"
    />
  </svg>
</template>
