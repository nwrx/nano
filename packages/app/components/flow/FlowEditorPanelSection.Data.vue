<script setup lang="ts">
defineProps<{
  data: Record<string, unknown>
  label?: string
  labelEmpty?: string
}>()

const { t } = useI18n()
</script>

<template>
  <div>

    <!-- Label -->
    <p class="text-sm text-subtle" v-text="label" />

    <!-- No data -->
    <div class="border border-editor rounded select-text bg-editor-panel-data">
      <template v-if="Object.values(data).length === 0">
        <div class="text-center text-sm text-editor-node">
          {{ labelEmpty || t('empty') }}
        </div>
      </template>

      <!-- Data -->
      <div v-else>
        <FlowEditorPanelSectionDataProperty
          v-for="(value, name) in data"
          :key="name"
          :name="name"
          :value="value"
        />
      </div>
    </div>
  </div>
</template>

<i18n lang="yaml">
  en:
    empty: No data
  fr:
    empty: Aucune donnée
  de:
    empty: Keine Daten
  es:
    empty: Sin datos
  zh:
    empty: 没有数据
</i18n>
