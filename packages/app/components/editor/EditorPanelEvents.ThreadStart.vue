<script setup lang="ts">
import type { FlowSessionEventPayload } from '@nwrx/api'
defineProps<{ event: FlowSessionEventPayload<'thread:start'> }>()
const { t } = useI18n()
</script>

<template>
  <EditorPanelDataContainer :title="t('title')">
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
        {{ t('empty') }}
      </div>
    </template>
  </EditorPanelDataContainer>
</template>

<i18n lang="yaml">
en:
  title: Flow input
  empty: The flow did not receive any input data.
fr:
  title: Entrée de flux
  empty: Le flux n'a reçu aucune donnée en entrée.
de:
  title: Flow-Eingabe
  empty: Der Flow hat keine Eingabedaten erhalten.
es:
  title: Entrada de flujo
  empty: El flujo no recibió ningún dato de entrada.
zh:
  title: 流输入
  empty: 流没有接收任何输入数据。
</i18n>
