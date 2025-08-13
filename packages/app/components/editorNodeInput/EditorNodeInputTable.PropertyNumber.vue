<!-- eslint-disable vue/require-valid-default-prop -->
<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name?: string
    defaultValue?: unknown
    min?: number
    max?: number
    step?: number
  }>(),
  {
    name: '',
    defaultValue: () => 0,
    min: 0,
    max: 100,
    step: 1,
  },
)

const isDragging = ref(false)
const value = defineModel('modelValue')

function handleSliderChange(event: MouseEvent) {
  if (!isDragging.value) return
  if (event.buttons !== 1) return
  const { min, max, step } = props
  const target = event.target as HTMLDivElement
  const { width, left } = target.getBoundingClientRect()
  const percentage = (event.clientX - left) / (width)
  const valueRelative = min + percentage * (max - min)
  const valueStepped = Math.round(valueRelative / step) * step
  value.value = Math.round(valueStepped * 100) / 100
}

const valueClamped = computed(() => {
  const { min, max, defaultValue } = props
  let valueValue = value.value
  if (typeof valueValue === 'string') valueValue = Number.parseFloat(valueValue)
  if (typeof valueValue !== 'number') valueValue = typeof defaultValue === 'number' ? defaultValue : min
  if ((valueValue as number) < min) valueValue = min
  if ((valueValue as number) > max) valueValue = max
  return valueValue as number
})

const width = computed(() => {
  const { min, max } = props
  const percentage = (valueClamped.value - min) / (max - min) * 100
  return `${percentage}%`
})
</script>

<template>
  <div class="flex items-center cursor-pointer w-full h-full px-sm text-sm">

    <!-- Bar -->
    <div
      class="w-full h-5 rd bg-subtle overflow-hidden relative"
      @mousedown="(event) => { isDragging = true; handleSliderChange(event) }"
      @mouseup="() => isDragging = false"
      @mousemove="(event) => handleSliderChange(event)">

      <!-- Slider -->
      <div class="w-full h-full pointer-events-none">
        <div
          class="
            absolute px-sm w-full h-full
            flex items-center justify-between
            bg-active text-active
          "
          :style="{
            maskImage: `linear-gradient(to right, white ${width}, transparent ${width})`,
          }">
          <span>{{ name }}</span>
          <span :class="{ 'text-subtle': value === undefined }">{{ value }}</span>
        </div>

        <!-- Background -->
        <div
          class="absolute px-sm w-full h-full flex items-center justify-between b b-app rd"
          :style="{ maskImage: `linear-gradient(to right, transparent ${width}, white ${width})` }">
          <span>{{ name }}</span>
          <span :class="{ 'text-subtle': value === undefined }">{{ value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
