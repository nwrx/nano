<script setup lang="ts">
import type { FlowLinkProps } from '~/composables/useFlowEditorView'

const props = defineProps<{ zoom?: number } & FlowLinkProps>()
const id = useId()

const offset = computed(() => {
  const x = props.targetX - props.sourceX
  const y = props.targetY - props.sourceY
  const lineLength = Math.hypot(x, y)
  return Math.max(30, lineLength / 2)
})

const strokeWidth = computed(() =>
  Math.max(4, 3 / (props.zoom ?? 1)),
)

const d = computed(() => [
  'M',
  props.sourceX,
  props.sourceY + 0.5,
  'C',
  props.sourceX + offset.value,
  props.sourceY,
  props.targetX - offset.value,
  props.targetY,
  props.targetX,
  props.targetY,
].join(' '))

const linearGradient = computed(() => ({
  x1: props.sourceX >= props.targetX ? 1 : 0,
  y1: props.sourceY >= props.targetY ? 1 : 0,
  x2: props.sourceX >= props.targetX ? 0 : 1,
  y2: props.sourceY >= props.targetY ? 0 : 1,
}))
</script>

<template>
  <svg class="w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient :id v-bind="linearGradient">
        <stop :stop-color="sourceColor" offset="0.25" />
        <stop :stop-color="targetColor" offset="0.75" />
      </linearGradient>
    </defs>
    <path
      :d="d"
      :stroke="`url(#${id})`"
      :stroke-width="strokeWidth"
      fill="transparent"
    />
  </svg>
</template>
