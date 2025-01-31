<script setup lang="ts">
import type { FlowSessionSecretJSON, FlowSessionVariableJSON } from '@nwrx/api'

const props = defineProps<{
  name: string
  methods: string[]
  description: string
  secrets: FlowSessionSecretJSON[]
  variables: FlowSessionVariableJSON[]
  isMethodsOpen: boolean
  isSecretsOpen: boolean
  isVariablesOpen: boolean
}>()

const emit = defineEmits<{
  'update:isMethodsOpen': [isMethodsOpen: boolean]
  'update:isSecretsOpen': [isSecretsOpen: boolean]
  'update:isVariablesOpen': [isVariablesOpen: boolean]
  setName: [name: string]
  setMethods: [methods: string[]]
  setDescription: [description: string]
  variableCreate: [name: string, value: string]
  variableUpdate: [name: string, value: string]
  variableRemove: [name: string]
  secretCreate: [name: string, value: string]
  secretUpdate: [name: string, value: string]
  secretRemove: [name: string]
}>()

// --- Two-way binding
const name = useVModel(props, 'name', emit, { passive: true, eventName: 'setName' })
const methods = useVModel(props, 'methods', emit, { passive: true, eventName: 'setMethods' })
const description = useVModel(props, 'description', emit, { passive: true, eventName: 'setDescription' })
const isMethodsOpen = useVModel(props, 'isMethodsOpen', emit, { passive: true })
const isSecretsOpen = useVModel(props, 'isSecretsOpen', emit, { passive: true })
const isVariablesOpen = useVModel(props, 'isVariablesOpen', emit, { passive: true })
</script>

<template>
  <div>

    <!-- Title & Desscription -->
    <FlowEditorPanelSectionName
      v-model:name="name"
      v-model:description="description"
    />

    <!-- Input Methods -->
    <FlowEditorPanelSectionToggle
      v-model="methods"
      v-model:isOpen="isMethodsOpen"
      type="checkbox"
      title="Trigger Methods"
      text="Define how this flow can be triggered."
      :values="[
        { value: 'http', icon: 'i-carbon:code', label: 'HTTP', hint: 'Allow this flow to be triggered via HTTP requests.' },
        { value: 'websocket', icon: 'i-carbon:arrows-vertical', label: 'WebSocket', hint: 'Allow this flow to be triggered via WebSocket requests.' },
        { value: 'cron', icon: 'i-carbon:time', label: 'Schedule', hint: 'Allow this flow to be triggered via manual start.' },
      ]"
    />

    <FlowEditorPanelSectionVariables
      v-model:isOpen="isVariablesOpen"
      :variables="variables"
      title="Variables"
      text="List and define variables."
      createTitle="Create a new variable"
      createText="Define a new variable with a name and value."
      createLabel="+ CREATE_NEW_VARIABLE"
      updateTitle="Update variable"
      updateText="Update the value of the variable."
      @create="(name, value) => emit('variableCreate', name, value)"
      @update="(name, value) => emit('variableUpdate', name, value)"
      @delete="(name) => emit('variableRemove', name)"
    />

    <FlowEditorPanelSectionVariables
      v-model:isOpen="isSecretsOpen"
      :variables="secrets"
      title="Secrets"
      text="Create, replace, or remove secrets."
      createTitle="Create a new secret"
      createText="Define a new secret with a name and value."
      createLabel="+ CREATE_NEW_SECRET"
      updateTitle="Update secret"
      updateText="Update the value of the secret."
      @create="(name, value) => emit('secretCreate', name, value)"
      @update="(name, value) => emit('secretUpdate', name, value)"
      @delete="(name) => emit('secretRemove', name)"
    />
  </div>
</template>
