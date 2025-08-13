<script setup lang="ts">
import type { ThreadTree } from '~/composables/useThread'

const props = withDefaults(defineProps<{
  width?: number
  height?: number
  thickness?: number
  color?: string
  showPin?: boolean
  showLine?: ThreadTree.Line
}>(), {
  width: 20,
  height: 20,
  thickness: 2,
  color: 'currentColor',
  showPin: true,
})

const pinHeight = ref(15)
const paths = computed<string[]>(() => {
  const w = props.width - props.thickness - 4
  const h = props.height
  if (props.showLine === 'start')
    return [`M ${w} ${pinHeight.value} V ${h}`]
  else if (props.showLine === 'end')
    return [`M ${w} 0 V ${pinHeight.value}`]
  else if (props.showLine === 'hidden')
    return []
  else
    return [`M ${w} 0 V ${h}`]
})
</script>

<template>
  <svg
    :width="width"
    :height="height + 1"
    :viewBox="`0 0 ${width - thickness} ${height}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">

    <!-- Path with configurable direction -->
    <g>
      <path
        v-for="path in paths"
        :key="path"
        :d="path"
        :stroke="color ?? 'currentColor'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-="10"
        :stroke-width="thickness"
        fill="none"
      />

      <!-- Pin -->
      <circle
        v-if="showPin"
        :cx="width - thickness - 4"
        :cy="pinHeight"
        r="4"
        :fill="color ?? 'currentColor'"
        :stroke-width="thickness"
      />
    </g>
  </svg>
</template>
