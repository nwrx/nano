<script setup lang="ts">
const props = defineProps<{
  name: string
  modelValue: number
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

const width = computed(() => {
  const { min = 0, max = 100 } = props
  const percentage = (model.value - min) / (max - min) * 100
  return `${percentage}%`
})
</script>

<template>
  <div ref="input" class="flex items-center cursor-pointer w-full h-8 px-sm text-sm">

    <!-- Bar -->
    <div
      class="w-full h-7 rd bg-prominent overflow-hidden relative"
      @mousedown="(event) => { isDragging = true; handleSliderChange(event) }"
      @mouseup="() => isDragging = false"
      @mouseleave="() => isDragging = false"
      @mousemove="(event) => handleSliderChange(event)">

      <!-- Slider -->
      <div class="w-full h-full pointer-events-none">
        <div
          class="absolute px-sm w-full h-full flex items-center justify-between bg-primary-500 text-white"
          :style="{ maskImage: `linear-gradient(to right, white ${width}, transparent ${width})` }">
          <span v-text="name" />
          <span v-text="model" />
        </div>

        <!-- Background -->
        <div
          class="absolute px-sm w-full h-full flex items-center justify-between"
          :style="{ maskImage: `linear-gradient(to right, transparent ${width}, white ${width})` }">
          <span v-text="name" />
          <span v-text="model" />
        </div>
      </div>
    </div>
  </div>
</template>
