<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts" generic="T">
import type { BaseInputTextProps } from '@unshared/vue/BaseInputText'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import { BaseInputText } from '@unshared/vue/BaseInputText'

const props = defineProps<BaseInputTextProps<T> & {
  label?: string
  hint?: string
  icon?: string
  iconAppend?: string
  iconPrepend?: string
  textBefore?: string
  textAfter?: string
  classIcon?: string
  classInput?: string
  classGroup?: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

// --- Two-way binding.
const model = useVModel(props as { modelValue: T }, 'modelValue', emit, {
  passive: true,
})

// --- Focus the input when the group is clicked.
function handleGroupClick(event: MouseEvent) {
  const element = event.target as HTMLDivElement
  const input = element.querySelector('input')
  if (input) input.focus()
}

// --- Track the focus state so we can style the group.
const isFocused = ref(false)
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      class="text-xs block text-subtle mb-xs"
      v-text="label"
    />

    <!-- Text Before -->
    <div class="flex items-stretch w-full">
      <div
        v-if="textBefore"
        class="flex items-center justify-center input rounded-r-0 border-r-0"
        v-text="textBefore"
      />

      <!-- Input -->
      <div
        :class="[classGroup, {
          'rounded-l-none': textBefore,
          'rounded-r-none': textAfter,
          'cursor-text': !disabled,
          '!input-focus': isFocused,
          '!input-readonly': readonly,
        }]"
        class="
          flex items-center w-full group
          input hover:input-hover
          disabled:input-disabled
          active:input-focus
        "
        @click="(event) => handleGroupClick(event)">

        <!-- Icon Prepend -->
        <BaseIcon
          v-if="iconPrepend || icon"
          :icon="iconPrepend! || icon!"
          :class="classIcon"
          class="size-4 pointer-events-none mr-sm shrink-0"
        />

        <!-- Input -->
        <BaseInputText
          v-bind="props"
          v-model="model"
          :label="label"
          :class="classInput"
          class="w-full outline-none bg-transparent placeholder:text-subtle"
          @focus="() => isFocused = true"
          @blur="() => isFocused = false"
        />

        <!-- Loading -->
        <BaseIcon
          v-if="isLoading"
          icon="i-line-md:loading-loop"
          class="size-4 pointer-events-none ml-sm shrink-0"
        />

        <!-- Icon -->
        <BaseIcon
          v-else-if="iconAppend"
          :icon="iconAppend"
          :class="classIcon"
          class="size-4 pointer-events-none ml-sm shrink-0"
        />
      </div>

      <!-- Text After -->
      <p
        v-if="textAfter"
        class="flex items-center justify-center input input-readonly rounded-l-0 border-l-0"
        v-text="textAfter"
      />
    </div>

    <!-- Error -->
    <p v-if="error" class="text-xs text-danger-500 mt-xs">
      {{ error }}
    </p>

    <!-- Hint -->
    <p v-else-if="$slots.hint || hint" class="text-xs text-subtle mt-xs">
      <slot name="hint">
        {{ hint }}
      </slot>
    </p>
  </div>
</template>
