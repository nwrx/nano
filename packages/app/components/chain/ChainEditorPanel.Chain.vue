<script setup lang="ts">
const props =defineProps<{
  name: string
  description: string
  inputs: Array<{ name: string; type: string; key: string }>
}>()

const emit = defineEmits<{
  'update:name': [string]
  'update:icon': [string]
  'update:inputs': [Array<{ name: string; type: string; key: string }>]
}>()

const name = useVModel(props, 'name', emit, { passive: true })
const description = useVModel(props, 'description', emit, { passive: true })
const inputs = useVModel(props, 'inputs', emit, { passive: true, defaultValue: [] })

function addInput() {
  inputs.value.push({
    key: Math.random().toString(36).slice(7),
    name: '',
    type: 'primitive:string',
  })
}
</script>

<template>
  <div class="space-y-8 overflow-y-auto overflow-x-hidden">

    <!-- Title & Desscription -->
    <div>
      <input v-model="name" class="text-2xl font-bold outline-none bg-transparent w-full" />
      <input v-model="description" class="text-sm outline-none bg-transparent w-full" />
    </div>

    <!-- Divider -->
    <div class="border border-primary-200 rounded-full" />

    <div>
      <h3 class="text-lg font-bold">Chain Inputs</h3>
      <p class="text-sm text-gray-500">Specify the inputs this chain expects.</p>
    </div>

    <!-- Chain settings / Inputs -->
    <div class="w-full space-y-2">
      <div v-for="input in inputs" :key="input.key" class="grid cols-2 gap-2">
        <ChainEditorPanelField v-model="input.name" label="Name" />
        <ChainEditorPanelField v-model="input.type" label="Type" />
      </div>
    </div>

    <div class="flex items-center justify-start">
      <ButtonLink
        label="Add new input"
        icon="i-carbon:add"
        @click="() => addInput()"
        eager
      />
    </div>

    <!-- Divider -->
    <div class="border border-primary-200 rounded-full" />
  </div>
</template>
