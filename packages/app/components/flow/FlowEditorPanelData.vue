<script setup lang="ts">
import type { DataSocketJSON, NodeInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  name?: string
  node?: NodeInstanceJSON
  nodes?: NodeInstanceJSON[]
  socket?: DataSocketJSON
  modelValue?: unknown
  isEditable?: boolean
  isClearable?: boolean
}>()

const emit = defineEmits<{
  clear: []
  'update:modelValue': [value: unknown]
}>()

const model = useVModel(props, 'modelValue', emit, { passive: true })

// --- Resolve the name of the data value.
const name = computed(() => props.socket?.name ?? props.name)

// --- Conditionally show the detail view for complex values.
const hasDetail = computed(() => {
  if (props.socket?.control === undefined) return true
  if (props.socket?.control === 'socket') return true
  if (typeof model.value === 'object' && model.value !== null) return true
  if (typeof model.value === 'string' && model.value.length > 20) return true
})

const isOpen = ref(false)
function toggle() {
  if (!hasDetail.value) return
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div
    class="
      flex flex-wrap items-stretch
      not-first:b-t b-editor first:rd-t last:rd-b
      ring-1 ring-transparent relative
      hover:ring-editor-active
    ">

    <!-- Header -->
    <div
      class="flex items-center w-full space-x-xs px-sm h-8"
      :class="{ 'cursor-pointer': hasDetail }"
      @mousedown="() => toggle()">
      <div
        class="text-start w-145px shrink-0"
        v-text="name"
      />

      <!-- Divider -->
      <div
        class="w-px h-full b-r b-editor transition"
        :class="{ 'b-transparent': isOpen }"
      />

      <!-- Value -->
      <div class="flex items-center grow transition">
        <FlowEditorPanelDataValue
          v-model="model"
          :name="name"
          :node="node"
          :nodes="nodes"
          :socket="socket"
          :isOpen="isOpen"
          :isEditable="isEditable"
          :isClearable="isClearable"
          :class="{ 'op-50': isOpen && hasDetail, 'select-none': hasDetail }"
        />
      </div>

      <!-- Collapse -->
      <BaseIcon
        v-if="hasDetail"
        icon="i-carbon:chevron-down"
        class="size-4 shrink-0 cursor-pointer transition"
        :class="{ 'rotate-180': isOpen }"
      />

      <!-- Clear -->
      <BaseIcon
        v-if="isClearable"
        icon="i-carbon:close"
        class="size-4 shrink-0 cursor-pointer transition"
        @mousedown="() => emit('clear')"
      />
    </div>

    <!-- Detail -->
    <BaseCollapse
      v-if="hasDetail"
      vertical
      :isOpen="isOpen"
      class="w-full b-t b-editor transition-all overflow-hidden"
      :class="{ 'op-0 pointer-events-none': !isOpen }">

      <!-- Content -->
      <div class="b-l-6px b-editor">
        <slot name="detail">
          <FlowEditorPanelDataDetail
            :key="String(model)"
            v-model="model"
            :node="node"
            :nodes="nodes"
            :socket="socket"
            :isEditable="isEditable"
            :isClearable="isClearable"
          />
        </slot>
      </div>
    </BaseCollapse>
  </div>
</template>
