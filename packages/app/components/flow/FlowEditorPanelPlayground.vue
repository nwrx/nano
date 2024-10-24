<script setup lang="ts">
import type { FlowSessionEventPayload, NodeInstanceJSON } from '@nwrx/api'
import { vMarkdown } from '#imports'

const props = defineProps<{
  events: FlowSessionEventPayload[]
  nodes: NodeInstanceJSON[]
}>()

const emit = defineEmits<{
  'start': [input: Record<string, string>]
}>()

// --- Localize
const { t } = useI18n()

// --- Messages
const EVENT_WHITELIST = new Set(['flow:start', 'flow:output'])
const messages = computed(() => props.events.filter(event => EVENT_WHITELIST.has(event.event)))

// --- Resolve the imputs of the flow.
const inputData = ref<Record<string, string>>({})
const inputNodes = computed(() => props.nodes.filter(node => node.kind === 'nwrx/core:input'))
const outputNodes = computed(() => props.nodes.filter(node => node.kind === 'nwrx/core:output'))
const isDisabled = computed(() => inputNodes.value.length === 0 || outputNodes.value.length === 0)

function setInputValue(name: string, value: string) {
  if (value.length > 0) return inputData.value = { ...inputData.value, [name]: value }
  delete inputData.value[name]
  inputData.value = { ...inputData.value }
}
</script>

<template>
  <div class="flex flex-col h-full select-text relative">

    <!-- Disabled Overlay -->
    <div
      v-if="isDisabled"
      class="absolute inset-0 backdrop-opacity-50 flex items-center justify-center p-xl">
      <div class="text-app text-center">
        <h2 class="text-lg font-bold">{{ t('disabled.title') }}</h2>
        <div class="text-sm">{{ t('disabled.message') }}</div>
      </div>
    </div>

    <!-- Messages -->
    <template v-if="!isDisabled">
      <div
        v-for="(event, index) in messages"
        :key="index"
        class="p-md hover:bg-editor-panel-data">

        <!-- Input -->
        <FlowEditorPanelPlaygroundMessageInput v-if="event.event === 'flow:start'" :event="event" />

        <!-- Output -->
        <template v-else-if="event.event === 'flow:output'">
          <div class="text-xs text-emphasized">
            {{ event.name }}
          </div>
          <div
            v-markdown="String(event.value)"
            class="markdown"
          />
        </template>

      </div>
    </template>

    <!-- User Input -->
    <form
      class="flex p-md mt-auto b-t b-editor space-x-sm"
      :class="{ 'op-50 pointer-events-none': isDisabled }"
      @submit.prevent="() => emit('start', inputData)">

      <!-- Value -->
      <div class="space-y-sm w-full">
        <BaseInputText
          v-for="(input, index) in inputNodes"
          :key="input.data.name as string"
          class="w-full px-sm py-xs mt-xs b b-transparent hover:b-editor rd bg-transparent outline-none"
          :placeholder="input.data.name as string"
          :modelValue="inputData[input.data.name as string]"
          @update:modelValue="(value: string) => setInputValue(input.data.name as string, value)"
        />
      </div>

      <FlowEditorFab
        type="submit"
        icon="i-carbon:send"
      />
    </form>
  </div>
</template>

<i18n lang="yaml">
  en:
    disabled.title: Playground Disabled
    disabled.message: Requires both an input and an output node. Add at least one of each to enable the playground.
  fr:
    disabled.title: Terrain de jeu désactivé
    disabled.message: Nécessite un nœud d'entrée et un nœud de sortie. Ajoutez au moins un de chaque pour activer le terrain de jeu.
  de:
    disabled.title: Spielplatz deaktiviert
    disabled.message: Benötigt einen Eingabe- und einen Ausgabeknoten. Fügen Sie mindestens einen von jedem hinzu, um den Spielplatz zu aktivieren.
  es:
    disabled.title: Patio de recreo deshabilitado
    disabled.message: Requiere un nodo de entrada y uno de salida. Agregue al menos uno de cada uno para habilitar el patio de recreo.
  zh:
    disabled.title: 游乐场已禁用
    disabled.message: 需要输入节点和输出节点。请添加至少一个输入节点和一个输出节点以启用游乐场。
</i18n>
