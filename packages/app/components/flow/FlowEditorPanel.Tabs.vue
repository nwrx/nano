<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  tabs: Array<{ label: string; id: string }>
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'update:modelValue': [value: string]
}>()

const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <div class="flex p-md w-full">
    <div class="flex border border-editor rounded">
      <BaseInputToggle
        v-for="tab in tabs"
        :key="tab.id"
        v-model="model"
        :value="tab.id"
        eager
        as="div"
        type="radio"
        class="
        flex items-center justify-center
        last:rd-r first:rd-l
        cursor-pointer px-md h-10 font-medium transition
        !selected:text-editor-active
        !selected:bg-editor-active
        hover:bg-editor-active/20
      ">
        {{ tab.label }}
      </BaseInputToggle>
    </div>
  </div>
</template>
