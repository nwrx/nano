<script setup lang="ts">
import type { FlowThreadNodeJSON, InputSocketJSON } from '@nwrx/api'

const props = defineProps<{
  name?: string
  node?: FlowThreadNodeJSON
  nodes?: FlowThreadNodeJSON[]
  socket?: InputSocketJSON
  modelValue?: unknown
  isOpen?: boolean
  isEditable?: boolean
  isClearable?: boolean
  isNameEditable?: boolean
  depth?: number
}>()

const emit = defineEmits<{
  clear: []
  'update:isOpen': [value: boolean]
  'update:modelValue': [value: unknown]
}>()

// --- Model & state
const model = useVModel(props, 'modelValue', emit, { passive: true })
const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
const name = computed(() => props.socket?.name ?? props.name)

// --- Conditionally show the detail view for complex values.
const hasDetail = computed(() => {
  if (props.socket?.control === 'socket') return true
  if (typeof model.value === 'object' && model.value !== null) return true
  if (typeof model.value === 'string' && model.value.length > 24) return true
})

function toggle() {
  if (!hasDetail.value) return
  isOpen.value = !isOpen.value
}

const cellStyle = computed(() => ({
  width: `${155 - (props.depth ?? 0) * 5}px`,
}))
</script>

<template>
  <div
    :class="{
      'hover:ring-editor-active group': !depth,
    }"
    class="
      flex flex-wrap items-stretch
      not-first:b-t b-editor
      ring-1 ring-transparent relative
    ">

    <!-- Header -->
    <div
      class="flex items-center w-full h-8"
      :class="{ 'cursor-pointer': hasDetail }"
      @mousedown="() => toggle()">

      <!-- Editable Name -->
      <input
        v-if="isNameEditable"
        v-model="name"
        :style="cellStyle"
        class="shrink-0 px-sm bg-transparent outline-none">

      <!-- Name -->
      <div
        v-else
        :style="cellStyle"
        class="text-start shrink-0 px-sm"
        v-text="name"
      />

      <!-- Divider -->
      <div class="w-px h-full b-r b-editor transition" />

      <!-- Value -->
      <EditorPanelDataValue
        v-model="model"
        :name="name"
        :node="node"
        :nodes="nodes"
        :socket="socket"
        :is-open="isOpen"
        :is-editable="isEditable"
        :is-clearable="isClearable"
        :class="{ 'pointer-events-none': hasDetail }"
      />

      <!-- Spacer -->
      <div class="grow" />

      <!-- Collapse -->
      <div class="flex items-center space-x-sm op-0 group-hover:op-100 px-sm">
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
          class="size-4 shrink-0 cursor-pointer"
          @mousedown.stop="() => emit('clear')"
        />
      </div>
    </div>

    <!-- Detail -->
    <BaseCollapse
      v-if="hasDetail"
      vertical
      :is-open="isOpen"
      class="w-full b-t b-editor transition-all overflow-hidden"
      :class="{ 'op-0 pointer-events-none': !isOpen }">

      <!-- Content -->
      <div class="b-l-6px b-editor">
        <slot name="detail">
          <EditorPanelDataDetail
            :key="String(model)"
            v-model="model"
            :node="node"
            :nodes="nodes"
            :socket="socket"
            :is-editable="isEditable"
            :is-clearable="isClearable"
            :depth="depth ? depth + 1 : 1"
          />
        </slot>
      </div>
    </BaseCollapse>
  </div>
</template>
