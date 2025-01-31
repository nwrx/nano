<script setup lang="ts">
import type { EditorSessionServerMessage } from '@nwrx/nano-api'
defineProps<{ event: EditorSessionServerMessage & { event: 'thread:end' } }>()
const { t } = useI18n()
</script>

<template>
  <EditorPanelDataContainer :title="t('title')">
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
        {{ t('empty') }}
      </div>
    </template>
  </EditorPanelDataContainer>
</template>

<i18n lang="yaml">
en:
  title: Flow output
  empty: The flow did not produce any output data.
fr:
  title: Sortie de flux
  empty: Le flux n'a produit aucune donnée en sortie.
de:
  title: Flow-Ausgabe
  empty: Der Flow hat keine Ausgabedaten erzeugt.
es:
  title: Salida de flujo
  empty: El flujo no produjo ningún dato de salida.
zh:
  title: 流输出
  empty: 流没有产生任何输出数据。
</i18n>
