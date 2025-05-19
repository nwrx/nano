<!-- eslint-disable @typescript-eslint/no-unnecessary-type-assertion -->
<!-- eslint-disable sonarjs/prefer-single-boolean-return -->
<script setup lang="ts" generic="T">
import Collapse from './Collapse.vue'
import DataSheetDetail from './DataSheet.Detail.vue'
import DataSheetRowName from './DataSheet.RowName.vue'
import DataSheetValue from './DataSheet.Value.vue'

const props = defineProps<{
  name?: string
  modelValue?: T
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
const name = useVModel(props, 'name', emit, { passive: true }) as Ref<string>
const model = useVModel(props, 'modelValue', emit, { passive: true }) as Ref<T>
const isOpen = useVModel(props, 'isOpen', emit, { passive: true }) as Ref<boolean>

// --- Conditionally show the detail view for complex values.
const hasDetail = computed(() => {
  if (typeof model.value === 'object' && model.value !== null) return true
  if (typeof model.value === 'string' && model.value.length > 24) return true
  return false
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
      class="flex items-center w-full h-8 relative"
      :class="{ 'cursor-pointer': hasDetail }"
      @mousedown="() => toggle()">

      <!-- Editable Name -->
      <DataSheetRowName
        v-model="name"
        :depth="depth"
        :is-editable="isNameEditable"
        class="grow min-w-40"
      />

      <!-- Divider -->
      <div class="w-px h-full b-r b-editor transition" />

      <!-- Value -->
      <div class="flex items-center">
        <DataSheetValue
          v-model="model"
          :name="name"
          :is-open="isOpen"
          :is-editable="isEditable"
          :is-clearable="isClearable"
          :class="{ 'pointer-events-none': hasDetail }"
        />

        <!-- Spacer -->
        <div class="grow" />

        <!-- Collapse -->
        <div class="flex items-center space-x-sm op-0 group-hover:op-100">
          <BaseIcon
            v-if="hasDetail"
            icon="i-carbon:chevron-down"
            class="size-4 shrink-0 cursor-pointer transition"
            :class="{ 'rotate-180': isOpen }"
          />

          <!-- Clear -->
          <!--
            <BaseIcon
            v-if="isClearable"
            icon="i-carbon:close"
            class="size-4 shrink-0 cursor-pointer"
            @mousedown.stop="() => emit('clear')"
            />
          -->
        </div>
      </div>
    </div>

    <!-- Detail -->
    <Collapse
      v-if="hasDetail"
      :model-value="isOpen"
      class="w-full b-t b-editor">

      <!-- Content -->
      <DataSheetDetail
        v-model="model"
        :is-editable="isEditable"
        :is-clearable="isClearable"
        :depth="depth ? depth + 1 : 1"
      />
    </Collapse>
  </div>
</template>
