<script setup lang="ts">
import type { BaseInputTextProps } from '@unshared/vue'

const props = defineProps<{
  inlineLeft?: boolean
  inlineRight?: boolean
  modelValue: string
} & BaseInputTextProps<string>>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
  defaultValue: '',
})
</script>

<template>
  <div class="w-full">

    <!-- Label -->
    <label
      class="block text-xs font-medium ml-2"
      v-text="label"
    />

    <!-- Input -->
    <BaseInputText
      v-bind="props"
      v-model="model"
      :class="{
        'rounded-l-none': inlineRight,
        'rounded-r-none': inlineLeft,
      }"
      class="
        w-full h-8
        text-xs
        outline-none px-2 py-1 rounded
        bg-primary-100

        text-black/70
        hover:text-black/80
        focus:text-black/90

        placeholder-black/20
        hover:placeholder-black/40
        focus:placeholder-black/0

        border-px
        border-primary-100
        hover:border-primary-200
        focus:border-primary-200

        bg-opacity-20
        hover:bg-opacity-60
        focus:bg-opacity-50
        hover:focus:bg-opacity-60

        transition-all duration-100
      "
    />
  </div>
</template>
