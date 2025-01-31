<script setup lang="ts">
import type { ComponentInstanceJSON, InputJSON } from '@nwrx/nano-api'

const props = defineProps<{
  name?: string
  node?: ComponentInstanceJSON
  nodes?: ComponentInstanceJSON[]
  socket?: InputJSON
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
</script>

<template>
  <div
    :class="{
      'hover:ring-editor-active group': !depth,
    }"
    class="
      flex flex-wrap items-stretch
      not-first:b-t b-editor
      ring-1 ring-transparent
    ">

    <!-- Header -->
    <div
      class="flex items-center w-full h-8"
      :class="{ 'cursor-pointer': hasDetail }"
      @mousedown="() => toggle()">

      <!-- Depth -->
      <div
        class="b-solid b-editor h-full transition"
        :style="{ borderWidth: `${(depth ?? 0) * 4}px` }"
      />

      <!-- Editable Name -->
      <input
        v-if="isNameEditable"
        v-model="name"
        class="shrink-0 px-sm bg-transparent outline-none w-2/5 max-w-80">

      <!-- Name -->
      <div
        v-else
        class="text-start shrink-0 px-sm line-clamp-1 w-2/5 max-w-80"
        v-text="name"
      />

      <!-- Divider -->
      <div class="w-px h-full b-r b-editor transition" />

      <!-- Value -->
      <div class="flex items-center w-3/5 shrink-0">
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
    </div>

    <!-- Detail -->
    <BaseCollapse
      v-if="isOpen && hasDetail"
      vertical
      :is-open="isOpen"
      class="w-full b-t b-editor transition-all overflow-hidden"
      :class="{ 'op-0 pointer-events-none': !isOpen }">

      <!-- Content -->
      <slot name="detail">
        <LazyEditorPanelDataDetail
          v-model="model"
          :node="node"
          :nodes="nodes"
          :socket="socket"
          :is-editable="isEditable"
          :is-clearable="isClearable"
          :depth="depth ? depth + 1 : 1"
        />
      </slot>
    </BaseCollapse>
  </div>
</template>]
