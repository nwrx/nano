<script setup lang="ts">
import type { FlowJSON } from '@nanoworks/core'
import type { FlowModuleObject } from '~/server/flow'

const props = defineProps<{
  flow: FlowJSON
  modules: FlowModuleObject[]
}>()

const emit = defineEmits<{
  'update:flow': [FlowJSON]
}>()

const flow = useVModel(props, 'flow', emit, {
  passive: true,
  defaultValue: {
    name: '',
    icon: 'i-carbon:flow',
    description: '',
    nodes: [],
    links: [],
  } as unknown as FlowJSON,
})

// function addInput() {
//   inputs.value.push({
//     key: Math.random().toString(36).slice(7),
//     name: '',
//     type: 'primitive:string',
//   })
// }
</script>

<template>
  <div class="space-y-8 overflow-y-auto overflow-x-hidden">

    <!-- Title & Desscription -->
    <div>
      <input
        v-model="flow.name"
        placeholder="Give your flow a name..."
        class="text-2xl font-bold outline-none bg-transparent w-full"
      />
      <input
        v-model="flow.description"
        placeholder="Describe your flow..."
        class="text-sm outline-none bg-transparent w-full"
      />
    </div>

    <!-- Divider -->
    <!-- <div class="border border-primary-200 rounded-full" /> -->

    <!--
      <div>
      <h3 class="text-lg font-bold">Chain Inputs</h3>
      <p class="text-sm text-gray-500">Specify the inputs this chain expects.</p>
      </div>
    -->

    <!-- Chain settings / Inputs -->
    <!--
      <div class="w-full space-y-2">
      <div v-for="input in inputs" :key="input.key" class="grid cols-2 gap-2">
      <FlowEditorPanelField v-model="input.name" label="Name" />
      <FlowEditorPanelField v-model="input.type" label="Type" />
      </div>
      </div>
    -->

    <!--
      <div class="flex items-center justify-start">
      <Button
      label="Add new input"
      icon="i-carbon:add"
      eager
      @click="() => addInput()"
      />
      </div>
    -->

    <!-- Divider -->
    <div class="border border-gray-200 rounded-full" />

    <!-- Registered modules -->
    <div class="space-y-4">

      <div v-for="module in modules" :key="module.id">
        <div class="text-lg font-bold">{{ module.name }}</div>
        <div class="text-sm text-gray-500">{{ module.description }}</div>
        <div class="space-y-2 mt-2">
          <FlowEditorDrawerModuleNode
            v-for="node in module.nodes"
            :key="node.name"
            :module="module"
            :node="node"
            class="max-w-xs"
          />
        </div>
      </div>
    </div>

  </div>
</template>
