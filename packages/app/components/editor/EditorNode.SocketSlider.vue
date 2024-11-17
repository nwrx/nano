<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
const props = defineProps<{
  name?: string
  modelValue?: number | string
  defaultValue?: unknown
  min?: number
  max?: number
  step?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const isDragging = ref(false)
const model = useVModel(props, 'modelValue', emit, {
  passive: true,
  eventName: 'update:modelValue',
})

/**
 * When the slider is clicked or dragged, update the model value
 * based on the mouse position and the `min`, `max`, and `step` props.
 *
 * @param event The mouse event that triggered the change.
 */
function handleSliderChange(event: MouseEvent) {
  if (!isDragging.value) return
  if (event.buttons !== 1) return
  const { min = 0, max = 100, step = 1 } = props
  const target = event.target as HTMLDivElement
  const { width, left } = target.getBoundingClientRect()
  const percentage = (event.clientX - left) / (width)
  const value = min + percentage * (max - min)
  const valueStepped = Math.round(value / step) * step
  model.value = Math.round(valueStepped * 100) / 100
}

const value = computed(() => {
  const { min = 0, max = 100, defaultValue } = props
  let value = model.value
  if (!value) value = typeof defaultValue === 'number' ? defaultValue : min
  if (typeof value === 'string') value = Number.parseFloat(value)
  if (value < min) value = min
  if (value > max) value = max
  return value
})

const width = computed(() => {
  const { min = 0, max = 100 } = props
  const percentage = (value.value - min) / (max - min) * 100
  return `${percentage}%`
})
</script>

<template>
  <div ref="input" class="flex items-center cursor-pointer w-full h-8 px-sm text-sm group">

    <!-- Bar -->
    <div
      class="w-full h-6 rd bg-prominent overflow-hidden relative b b-transparent group-hover:b-primary-500"
      @mousedown="(event) => { isDragging = true; handleSliderChange(event) }"
      @mouseup="() => isDragging = false"
      @mousemove="(event) => handleSliderChange(event)">

      <!-- Slider -->
      <div class="w-full h-full pointer-events-none">
        <div
          class="
            absolute px-sm w-full h-full transition
            flex items-center justify-between
            bg-primary-500/80 text-white
            group-hover:bg-primary-500
          "
          :style="{
            maskImage: `linear-gradient(to right, white ${width}, transparent ${width})`,
          }">
          <span>{{ name }}</span>
          <span :class="{ 'op-20': model === undefined }">{{ value }}</span>
        </div>

        <!-- Background -->
        <div
          class="absolute px-sm w-full h-full flex items-center justify-between"
          :style="{ maskImage: `linear-gradient(to right, transparent ${width}, white ${width})` }">
          <span>{{ name }}</span>
          <span :class="{ 'op-20': model === undefined }">{{ value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
