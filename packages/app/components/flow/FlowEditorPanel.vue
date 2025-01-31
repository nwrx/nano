<script setup lang="ts">
import type { FlowJSON, FlowNodeInstanceJSON } from '@nanoworks/core'
import type { FlowModuleObject } from '~/server/flow'

defineProps<{
  flow: FlowJSON
  node: FlowNodeInstanceJSON
  modules: FlowModuleObject[]
}>()

const emit = defineEmits<{
  'update:flow': [FlowJSON]
  // 'update:icon': [string]
  // 'update:description': [string]
}>()

// const name = useVModel(props, 'name', emit, { passive: true })
// // const icon = useVModel(props, 'icon', emit, { passive: true })
// const description = useVModel(props, 'description', emit, { passive: true })
// const inputs = ref<Array<{ name: string; type: string; key: string }>>([])

// function addInput() {
//   inputs.value.push({ name: '', type: '', key: Math.random().toString(36).slice(7) })
// }

const tabs = [
  { label: 'Flow', id: 'flow' },
  { label: 'Node', id: 'node' },
  { label: 'Logs', id: 'logs' },
]

const selectedTab = ref('flow')
</script>

<template>
  <div class="flex flex-col w-full p-8 gap-8">

    <!-- Tab selector -->
    <div class="flex gap-4">
      <BaseInputToggle
        v-for="tab in tabs"
        :key="tab.id"
        v-model="selectedTab"
        :value="tab.id"
        eager
        as="div"
        type="radio"
        class="
          bg-primary-600 bg-opacity-0 hover:bg-opacity-10
          px-4 py-2 rounded-md font-bold
          selected:text-white
          selected:bg-primary-600
          !selected:bg-opacity-100
          transition-colors
          cursor-pointer
        ">
        {{ tab.label }}
      </BaseInputToggle>
    </div>

    <!-- Flow settings -->
    <FlowEditorPanelFlow
      v-if="selectedTab === 'flow'"
      :flow="flow"
      :modules="modules"
      @update:flow="(flow) => emit('update:flow', flow)"
    />
  </div>
</template>
