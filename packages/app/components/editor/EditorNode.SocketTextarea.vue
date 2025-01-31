<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  name: string
  description?: string
  modelValue: string
  defaultValue?: unknown
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isDialogOpen = ref(false)
const model = useVModel(props, 'modelValue', emit, { passive: true })

function openDialog() {
  isDialogOpen.value = true
}
</script>

<template>
  <EditorNodeSocketGroup
    class="cursor-pointer pt-0.5 !items-start"
    @wheel.stop
    @mousedown.stop="() => openDialog()">

    <!-- Preview -->
    <div class="px-sm py-xs whitespace-pre-wrap line-clamp-4">
      <span class="text-subtle text-sm mr-sm">
        {{ name }}:
      </span>
      <span class="text-sm">
        {{ model ?? defaultValue }}
      </span>
    </div>
  </EditorNodeSocketGroup>

  <!-- Dialog -->
  <EditorNodeSocketTextareaDialog
    v-model="model"
    v-model:is-open="isDialogOpen"
    :name="name"
    :description="description"
  />
</template>
