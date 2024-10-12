<script setup lang="ts" generic="T">
import type { FlowNodePortValue } from '@nwrx/core'
import type { BaseInputListProps } from '@unshared/vue'
import type { BaseInputList } from '#components'
import type { ComponentInstance } from 'vue'

const props = defineProps<{
  name: string
  modelValue: unknown
  values: Array<FlowNodePortValue<T>>
  badge?: boolean
} & BaseInputListProps<unknown, unknown, false>>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const search = ref<string>('')
const input = ref<ComponentInstance<typeof BaseInputList>>()
const model = useVModel(props, 'modelValue', emit, {
  passive: true,
  eventName: 'update:modelValue',
})

function onClick() {
  if (!input.value) return
  const element = input.value.$el.querySelector('input')
  if (element) element.focus()
}
</script>

<template>
  <FlowEditorPortGroup class="h-8 cursor-pointer relative" @mousedown="() => onClick()">

    <!-- Label -->
    <FlowEditorPortLabel :label="name" />

    <!-- Field -->
    <BaseInputList
      ref="input"
      v-model="model"
      as="div"
      :options="values"
      :option-value="value => value.value"
      :option-label="value => value.label"
      :class="{ 'text-editor-node italic': !model }"
      class="flex items-center w-full h-full outline-none bg-transparent truncate">

      <!-- Current value -->
      <template #values="{ values }">
        <span v-if="values.length === 0" class="text-editor-node italic text-sm">
          No values
        </span>
        <FlowEditorPortLabel
          v-else-if="badge"
          :label="String(values[0].label)"
          class="truncate"
          light
        />
        <span v-else class="truncate w-full text-sm">
          {{ values[0].label }}
        </span>
      </template>

      <!-- Search -->
      <template #search="{ open, close }">
        <BaseInputText
          v-model="search"
          class="opacity-0 w-0 h-0"
          @focus="() => open()"
          @blur="() => close()"
        />
      </template>

      <!-- Options -->
      <template #options="{ options, isOpen, close }">
        <div
          v-if="isOpen"
          class="
            absolute left-0 top-full mt-xs
            bg-app border border-editor divide-y divide-app
            rounded w-full z-9999
            max-h-60 overflow-y-auto
          "
          @mousedown="() => close()"
          @wheel.stop>

          <!-- Option -->
          <div
            v-for="(option, index) in options"
            :key="index"
            :class="{
              'bg-app-prominent': option.value === model,
              'font-bold': option.isSelected(),
            }"
            class="
              flex items-center w-full p-2 cursor-pointer
              hover:bg-primary-500/5
            "
            @click="() => option.toggle()">

            <!-- Icon -->
            <BaseIcon
              v-if="option.option.icon"
              :icon="option.option.icon"
              :class="{
                'size-4': !option.option.description,
                'size-6': option.option.description,
              }"
              class="text-app mr-4"
              load
            />

            <!-- Name -->
            <div class="truncate">
              <div class="text-sm text-app truncate">{{ option.label }}</div>
              <div class="text-xs text-subtle truncate">{{ option.option.description }}</div>
            </div>
          </div>
        </div>
      </template>
    </BaseInputList>
  </FlowEditorPortGroup>
</template>
