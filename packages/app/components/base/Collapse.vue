<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
})
</script>

<template>
  <BaseCollapse
    vertical
    :is-open="model"
    :duration="300"
    :class="{ 'op-0': model !== true }"
    class="transition-all duration-slow">
    <slot />
  </BaseCollapse>
</template>
