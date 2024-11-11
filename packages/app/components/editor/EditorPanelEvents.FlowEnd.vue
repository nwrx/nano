<script setup lang="ts">
import type { FlowSessionEventPayload } from '@nwrx/api'
defineProps<{ event: FlowSessionEventPayload<'end'> }>()
const { t } = useI18n()
</script>

<template>
  <EditorPanelDataContainer :title="t('output.title')">
    <template v-if="Object.keys(event.output).length > 0">
      <EditorPanelData
        v-for="(value, name) in event.output"
        :key="name"
        :model-value="value"
        :name="name"
      />
    </template>
    <template v-else>
      <div class="text-subtle p-sm">
        {{ t('output.empty') }}
      </div>
    </template>
  </EditorPanelDataContainer>
</template>

<i18n lang="yaml">
en:
  output.title: Flow output
  output.empty: The flow did not produce any output data.
fr:
  output.title: Sortie de flux
  output.empty: Le flux n'a produit aucune donnée en sortie.
de:
  output.title: Flow-Ausgabe
  output.empty: Der Flow hat keine Ausgabedaten erzeugt.
es:
  output.title: Salida de flujo
  output.empty: El flujo no produjo ningún dato de salida.
zh:
  output.title: 流输出
  output.empty: 流没有产生任何输出数据。
</i18n>
