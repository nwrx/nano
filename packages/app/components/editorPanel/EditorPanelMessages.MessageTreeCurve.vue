<script setup lang="ts">
const props = defineProps<{
  width?: number
  height?: number
  tension?: number
  thickness?: number
  color?: string
  showPin?: boolean
  showLine?: 'close' | 'end' | 'open' | 'start' | 'straight'
}>()

const pinHeight = 20
const thicknessDefaulted = computed(() => props.thickness ?? 2)
const widthDefaulted = computed(() => (props.width ?? 20) - thicknessDefaulted.value)
const heightDefaulted = computed(() => props.height ?? 20)

const paths = computed<string[]>(() => {
  const w = widthDefaulted.value - 4
  const h = heightDefaulted.value
  const t = thicknessDefaulted.value
  const s = props.tension ?? 0.25

  if (props.showLine === 'open') {
    return [
      `M ${t} ${t} Q ${t} ${pinHeight * s}, ${w * 0.5} ${pinHeight * 0.5}`,
      `M ${w * 0.5} ${pinHeight * 0.5} Q ${w} ${h * (0.5 - s)}, ${w} ${pinHeight}`,
      `M ${w} ${pinHeight} V ${h}`,
    ]
  }
  else if (props.showLine === 'close') {
    return [
      `M ${w} ${t} V ${h * 0.5}`,
      `M ${w} ${pinHeight} Q ${w} ${h * (0.5 + s)}, ${w * 0.5} ${h * 0.75}`,
      `M ${w * 0.5} ${h * 0.75} Q ${t} ${h * (1 - s)}, ${t} ${h - t}`,
    ]
  }
  else if (props.showLine === 'start') {
    return [`M ${w} ${pinHeight} V ${h}`]
  }
  else if (props.showLine === 'end') {
    return [`M ${w} 0 V ${pinHeight}`]
  }
  else {
    return [`M ${w} 0 V ${h}`]
  }
})
</script>

<template>
  <svg
    :width="width ?? 20"
    :height="heightDefaulted"
    :viewBox="`0 0 ${widthDefaulted} ${heightDefaulted}`"
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
        :stroke-width="thicknessDefaulted"
        fill="none"
      />

      <!-- Pin -->
      <circle
        v-if="showPin"
        :cx="widthDefaulted - 4"
        :cy="pinHeight"
        r="4"
        :fill="color ?? 'currentColor'"
        :stroke-width="thicknessDefaulted"
      />
    </g>
  </svg>
</template>
