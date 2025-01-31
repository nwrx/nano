<script setup lang="ts">
const props = defineProps<{
  data: Array<{ name: string; value: string }>
  isOpen: boolean
  title: string
  text: string
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
</script>

<template>
  <FlowEditorPanelSection
    v-model="isOpen"
    :title="title"
    :text="text"
    class-content="group space-y-2">

    <div class="flex flex-wrap border border-black/10 bg-black/5 rounded">
      <template v-for="entry in data">
        <div class="text-sm w-1/3 px-2 py-1 truncate font-sans border-r border-black/10">{{ entry.name }}</div>
        <pre class="text-sm w-2/3 px-2 py-1 truncate font-mono">{{ entry.value }}</pre>
      </template>
    </div>

  </FlowEditorPanelSection>
</template>
