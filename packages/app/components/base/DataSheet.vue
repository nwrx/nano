<script setup lang="ts" generic="T extends object">
defineProps<{
  title?: string
  modelValue?: T
  optionsLabel?: T extends any[]
    ? (value: T[number], key: number) => string
    : (value: T[keyof T], key: keyof T) => string
}>()
</script>

<template>
  <div class="w-full">

    <!-- Label -->
    <p
      v-if="title"
      class="text-sm text-subtle mb-xs"
      v-text="title"
    />

    <!-- Data -->
    <div class="b b-editor rd select-text text-sm bg-editor-panel-data first:children:rd-t last:children:rd-b">
      <slot>
        <!-- @vue-expect-error: ignore `value` inference issue -->
        <DataSheetRow
          v-for="(value, key) in modelValue"
          :key="key"
          :name="optionsLabel ? optionsLabel(value, key) : String(key)"
          :model-value="value"
          :depth="0"
        />
      </slot>
    </div>
  </div>
</template>
