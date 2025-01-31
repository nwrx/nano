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
const message = ref<string>('')
const messages = computed(() => props.events.filter(event => (
  event.event === 'flow:input'
  || event.event === 'flow:output'
)))

// --- Check if there is at least one input and output node in the flow.
const isDisabled = computed(() => {
  const nodes = props.nodes ?? []
  return !nodes.some(node => node.kind === 'nwrx/core:input')
    || !nodes.some(node => node.kind === 'nwrx/core:output')
})
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
        :class="{
          'mb-md': event.event === 'flow:output',
        }"
        class="p-md hover:bg-editor-panel-data">
        <div>
          <div class="text-xs text-emphasized">{{ event.property }}</div>
          <div
            v-markdown="String(event.value)"
            class="prose text-sm !children:p-0 !children:m-0"
          />
        </div>
      </div>
    </template>

    <!-- User Input -->
    <form
      class="p-md mt-auto"
      :class="{ 'op-50 pointer-events-none': isDisabled }"
      @submit.prevent="() => emit('start', { message })">
      <InputText
        v-model="message"
        placeholder="Enter your message..."
      />
      <Button
        class="w-full mt-2"
        label="Send"
        type="submit"
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
