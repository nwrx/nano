<script setup lang="ts">
const props = defineProps<{
  name: string
  values: Record<string, string> | string[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
  eventName: 'update:modelValue',
})
</script>

<template>
  <select
    v-model="model"
    :class="{
      'text-black/50': model === undefined,
    }"
    class="
          w-full text-start px-2 py-1 outline-none
          bg-transparent border-transparent border
          appearance-none rounded
          hover:bg-primary-200
          focus:bg-primary-200
          focus:border-primary-500
          placeholder-black/50
        ">
    <option value="undefined" disabled selected>{{ name }}</option>
    <template v-if="Array.isArray(values)">
      <option
        v-for="value in values"
        :key="String(value)"
        :value="value"
        v-text="value"
      />
    </template>
    <template v-else>
      <option
        v-for="(value, label) in values"
        :key="String(value)"
        :value="value"
        v-text="label"
      />
    </template>
  </select>
</template>
