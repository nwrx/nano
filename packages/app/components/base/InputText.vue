<script setup lang="ts" generic="T">
import type { BaseInputTextProps } from '@unshared/vue'

const props = defineProps<{
  hint?: string
  label?: string
  icon?: string
  iconAppend?: string
  iconPrepend?: string
  iconClass?: string
  required?: boolean
  textBefore?: string
  textAfter?: string
  classInput?: string
  classGroup?: string
} & BaseInputTextProps<T>>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

const model = useVModel(props as { modelValue: T }, 'modelValue', emit, {
  passive: true,
})
</script>

<template>
  <div class="w-full" :class="$attrs.class">
    <label
      v-if="label"
      class="text-xs block mb-1 opacity-80"
      v-text="required ? `${label} *` : label"
    />

    <!-- Text Before -->
    <div class="flex items-stretch w-full">
      <div
        v-if="textBefore"
        class="
          flex items-center justify-center min-h-10
          px-4 bg-black/5 rounded-l
          whitespace-nowrap text-black text-sm
          border border-r-0 border-black/20
        "
        v-text="textBefore">
      </div>

      <div class="relative w-full group" :class="classGroup">
        <BaseInputText
          v-bind="props"
          v-model="model"
          :label="label"
          :class="[classInput, {
            'pl-12': iconPrepend || icon,
            'pr-12': iconAppend,
            'rounded-r-none': textAfter,
            'rounded-l-none': textBefore,
          }]"
          class-disabled="
            bg-gray text-gray
          "
          class-error="
            !bg-danger-500 text-white
          "
          class="
          w-full p-3 py-2 h-full text-sm
          rounded border min-h-10
          outline-none

          hover:text-opacity-100
          focus:text-opacity-90
          placeholder-opacity-60

          dark:text-white/70
          dark:hover:text-white/100
          dark:focus:text-white/90
          dark:placeholder-white/30

          border-black/20
          hover:border-primary-500/70
          focus:border-primary-500/100

          bg-black/0
          hover:bg-primary-500/5
          focus:bg-primary-500/8
          active:bg-primary-500/8

          dark:bg-primary-900
          dark:hover:bg-primary-800/20
          dark:focus:bg-primary-800/10
            transition-all duration-100
        "
        />

        <!-- Text After -->
        <p v-if="textAfter" class="text-sm opacity-60">
          {{ textAfter }}
        </p>

        <!-- Icon -->
        <BaseIcon
          v-if="iconPrepend || icon"
          as="div"
          :icon="iconPrepend! || icon!"
          :class="iconClass"
          class="
            absolute top-0 left-0 flex items-center justify-center text-base
            h-full px-3 mx-3 pointer-events-none
            text-primary-900 dark:text-black
            opacity-50
            group-hover:opacity-100
            group-hover:text-primary-500
            transition-all duration-100
          "
        />

        <!-- Icon -->
        <BaseIcon
          v-if="iconAppend"
          :icon="iconAppend"
          :class="iconClass"
          class="
            absolute top-0 right-0 flex items-center justify-center text-base
            h-full px-3 mx-3 pointer-events-none
            text-primary-900 dark:text-black
            opacity-60 group-hover:opacity-100
          "
        />
      </div>
    </div>

    <!-- Hint -->
    <p v-if="$slots.hint || hint" class="text-xs opacity-50 mt-1">
      <slot name="hint">
        {{ hint }}
      </slot>
    </p>
  </div>
</template>
