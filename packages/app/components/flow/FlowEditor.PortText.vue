<script setup lang="ts">
const props = defineProps<{
  name: string
  modelValue: string
  defaultValue: string
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
  <FlowEditorPortGroup class="cursor-text" @click="() => input?.focus()">

    <!-- Label -->
    <FlowEditorPortLabel light :label="name" />

    <!-- Field -->
    <input
      ref="input"
      v-model="model"
      :placeholder="defaultValue"
      :class="{ 'text-editor-node italic': !model }"
      class="w-full outline-none bg-transparent text-sm"
    />
  </FlowEditorPortGroup>
</template>
