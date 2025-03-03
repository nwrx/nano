<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts" generic="T, V, M extends boolean">
import type { BaseInputListProps } from '@unshared/vue'

const props = defineProps<BaseInputListProps<T, V, M> & {
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
  optionIcon?: (value: T) => string
  optionText?: (value: T) => string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: M extends true ? V[] : V]
}>()

// --- Focus the input when the group is clicked.
function handleGroupClick(event: MouseEvent) {
  const element = event.target as HTMLDivElement
  const input = element.querySelector('input')
  if (input) input.focus()
}

// --- Track the focus state so we can style the group.
const isFocused = ref(false)
const isFocusedDelayed = refDebounced(isFocused, 1)

// --- Two-way binding.
const model = useVModel(props as { modelValue: M extends true ? V[] : V }, 'modelValue', emit, { passive: true })
const search = useVModel(props as { search: string }, 'search', emit, { passive: true })
</script>

<template>
  <div class="w-full relative">
    <label
      v-if="label"
      class="text-xs block text-subtle mb-xs"
      v-text="label"
    />

    <!-- Text Before -->
    <div class="flex items-stretch w-full">
      <div
        v-if="textBefore"
        class="flex items-center justify-center input input-disabled rounded-r-0 border-r-0"
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
          transition
        "
        @click="(event) => handleGroupClick(event)">

        <!-- Icon Prepend -->
        <BaseIcon
          v-if="iconPrepend || icon"
          :icon="iconPrepend! || icon!"
          :class="classIcon"
          class="size-4 pointer-events-none mr-sm"
        />

        <BaseInputList
          v-bind="props"
          v-model="model"
          v-model:search="search"
          class="flex w-full">

          <template #search>
            <input
              v-model="search"
              class="w-full outline-none bg-transparent"
              @focus="() => isFocused = true"
              @blur="() => isFocused = false">
          </template>

          <template #values="{ values }">
            <div class="flex flex-wrap gap-xs">
              <Badge
                v-for="option in values.filter(option => option.isSelected())"
                :key="option.label"
                :label="option.label"
                :icon="optionIcon ? optionIcon(option.option) : undefined"
                class="flex items-center gap-xs p-xs bg-subtle rd-r-md space-x-xs"
              />
            </div>

          </template>

          <template #options="{ options }">
            <Transition
              :duration="100"
              leave-active-class="transition"
              enter-active-class="transition"
              enter-from-class="-translate-y-2 op-0"
              enter-to-class="translate-y-0 op-100"
              leave-from-class="translate-y-0 op-100"
              leave-to-class="-translate-y-2 op-0">
              <div
                v-if="isFocusedDelayed"
                class="absolute left-0 w-full top-full bg-subtle
                  p-sm space-y-xs rd b b-app z-10 mt-sm
                  overflow-y-auto overflow-x-hidden max-h-100
                "
                @wheel.stop>

                <!-- When no options are available, show a message. -->
                <ul>
                  <li
                    v-for="option in options"
                    :key="option.label"
                    class="flex items-center gap-sm p-xs hover:bg-emphasized rounded-md cursor-pointer"
                    :class="{ 'bg-emphasized': option.isSelected() }"
                    @mousedown="() => option.toggle()">
                    <BaseIcon
                      v-if="optionIcon"
                      :icon="optionIcon(option.option)"
                      class="size-4"
                    />
                    <h3 class="text-sm" :class="{ 'font-bold': option.isSelected() }">
                      {{ option.label }}
                    </h3>
                    <p v-if="optionText" class="text-xs text-subtle">
                      {{ optionText(option.option) }}
                    </p>
                    <div class="grow" />
                    <BaseIcon
                      v-if="option.isSelected()"
                      icon="i-carbon:dot-mark"
                      class="size-4 text-success-500"
                    />
                  </li>
                </ul>

              </div>
            </Transition>
          </template>
        </BaseInputList>

        <!-- Icon -->
        <BaseIcon
          v-if="iconAppend"
          :icon="iconAppend"
          :class="classIcon"
          class="size-4 pointer-events-none ml-sm"
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
