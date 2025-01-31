<script setup lang="ts">
import type { FlowSessionEventPayload } from '@nwrx/api'
defineProps<{ event: FlowSessionEventPayload<'flowStart'> }>()
const { t } = useI18n()
</script>

<template>
  <EditorPanelDataContainer :title="t('input.title')">
    <template v-if="Object.keys(event.input).length > 0">
      <EditorPanelData
        v-for="(value, name) in event.input"
        :key="name"
        :name="name"
        :model-value="value"
      />
    </template>
    <template v-else>
      <div class="text-subtle p-sm">
        {{ t('input.empty') }}
      </div>
    </template>
  </EditorPanelDataContainer>
</template>

<i18n lang="yaml">
en:
  input.title: Flow input
  input.empty: The flow did not receive any input data.
fr:
  input.title: Entrée de flux
  input.empty: Le flux n'a reçu aucune donnée en entrée.
de:
  input.title: Flow-Eingabe
  input.empty: Der Flow hat keine Eingabedaten erhalten.
es:
  input.title: Entrada de flujo
  input.empty: El flujo no recibió ningún dato de entrada.
zh:
  input.title: 流输入
  input.empty: 流没有接收任何输入数据。
</i18n>
