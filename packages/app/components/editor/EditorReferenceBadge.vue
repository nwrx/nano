<script setup lang="ts">
const props = defineProps<{
  value?: unknown
}>()

const parts = computed(() => {
  const value = props.value
  if (!value
    || typeof value !== 'object'
    || !('$ref' in value)
    || typeof value.$ref !== 'string'
    || !value.$ref.startsWith('#/')) return []
  return value.$ref.split('/').slice(1)
})

const icon = computed(() => {
  if (parts.value.length === 0) return
  const type = parts.value[0]
  if (type === 'Variables') return 'i-carbon:password'
})

const values = computed(() => {
  if (parts.value.length === 0) return []
  return parts.value.slice(1)
})
</script>

<template>
  <div
    class="
      flex items-center space-x-xs text-sm font-mono
      text-app rd
    ">

    <!-- Icon -->
    <BaseIcon
      :icon="icon"
      class="size-4 text-subtle"
    />

    <!-- Value -->
    <template v-for="(vText, index) in values" :key="index">
      <span
        :class="{
          'text-subtle truncate': index !== values.length - 1,
          'font-normal': index === values.length - 1,
        }"
        v-text="vText"
      />
      <BaseIcon
        v-if="index < values.length - 1"
        icon="i-carbon:chevron-right"
        class="size-3"
      />
    </template>
  </div>
</template>
