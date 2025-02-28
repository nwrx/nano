<script setup lang="ts">
import type { SchemaOption } from '@nwrx/nano/utils'

const props = defineProps<{
  name?: string
  modelValue?: unknown
  options?: SchemaOption[]
  defaultValue?: unknown
}>()

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
})

function isSelected(value: unknown) {
  const currentValue = model.value ?? props.defaultValue
  return JSON.stringify(value) === JSON.stringify(currentValue)
}
</script>

<template>
  <div
    class="
      flex ring ring-editor rd overflow-hidden w-full box-border
      hover:ring-editor-active text-xs h-6 my-xs
    ">

    <div
      v-for="(option, key) in options"
      :key="key"
      class="
        flex items-center justify-center
        cursor-pointer grow h-full px-md
        hover:bg-emphasized text-center
        b b-transparent last:rd-r first:rd-l
      "
      :class="{
        'bg-texture-black/20 !bg-editor-active text-editor-active': isSelected(option.value),
      }"
      @mousedown="() => model = option.value">

      <!-- Label -->
      <span>{{ option.label }}</span>

    </div>
  </div>
</template>
