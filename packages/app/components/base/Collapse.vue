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
    :class="{ '!h-0 op-0 pointer-events-none': model !== true }"
    class="transition-all duration-slow">
    <slot />
  </BaseCollapse>
</template>
