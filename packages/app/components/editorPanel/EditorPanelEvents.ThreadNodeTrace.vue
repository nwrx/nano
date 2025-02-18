<script setup lang="ts">
import type { EditorSessionServerMessage } from '@nwrx/nano-api'

defineProps<{
  event?: EditorSessionServerMessage & { event: 'thread:nodeTrace' }
}>()

const { t } = useI18n()
</script>

<template>
  <EditorPanelDataContainer :title="t('title')">
    <template v-if="event && Object.keys(event.data).length > 0">
      <EditorPanelData
        v-for="(value, key) in event.data"
        :key="key"
        :name="key"
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
  title: Node Trace
  empty: The trace did not provide any data.
fr:
  title: Trace de nœud
  empty: 'La trace n''a fourni aucune donnée.'
de:
  title: Knotenverfolgung
  empty: Die Spur hat keine Daten geliefert.
es:
  title: Rastreo de nodos
  empty: La traza no proporcionó datos.
zh:
  title: 节点跟踪
  empty: 跟踪未提供任何数据。
</i18n>
