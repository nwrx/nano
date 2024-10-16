<script setup lang="ts">
const props = defineProps<{
  name: string
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const input = ref<HTMLInputElement>()
const model = useVModel(props, 'modelValue', emit, {
  passive: true,
  eventName: 'update:modelValue',
})
</script>

<template>
  <FlowEditorSocketGroup class="cursor-text" @click="() => input?.focus()">

    <!-- Label -->
    <FlowEditorSocketLabel :label="name" />

    <!-- Field -->
    <input
      ref="input"
      v-model="model"
      :class="{ 'text-editor-node italic': !model }"
      class="w-full outline-none bg-transparent text-sm h-8"
    />
  </FlowEditorSocketGroup>
</template>
