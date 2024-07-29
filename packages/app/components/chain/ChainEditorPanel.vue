<script setup lang="ts">
import type { ChainNodeObject } from '@hsjm/oblisk-core'

const props = defineProps<{
  name: string
  icon?: string
  description: string
  node: ChainNodeObject
}>()

const emit = defineEmits<{
  'update:name': [string]
  // 'update:icon': [string]
  'update:description': [string]
}>()

const name = useVModel(props, 'name', emit, { passive: true })
// const icon = useVModel(props, 'icon', emit, { passive: true })
const description = useVModel(props, 'description', emit, { passive: true })
const inputs = ref<Array<{ name: string; type: string; key: string }>>([])

function addInput() {
  inputs.value.push({ name: '', type: '', key: Math.random().toString(36).slice(7) })
}

const tabs = [
  { label: 'Chain', id: 'chain' },
  { label: 'Node', id: 'node' },
  { label: 'Logs', id: 'logs' },
]

const selectedTab = ref('chain')
</script>

<template>
  <div class="flex flex-col w-full p-8 gap-8">

    <!-- Tab selector -->
    <div class="flex gap-4">
      <BaseInputToggle
        v-for="tab in tabs"
        :key="tab.id"
        :value="tab.id"
        eager
        as="div"
        type="radio"
        v-model="selectedTab"
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

    <!-- Chain settings -->
    <ChainEditorPanelChain
      v-if="selectedTab === 'chain'"
      v-model:name="name"
      v-model:description="description"
      v-model:inputs="inputs"
    />
  </div>
</template>
