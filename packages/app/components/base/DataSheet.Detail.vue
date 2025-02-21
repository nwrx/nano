<!-- eslint-disable vue/no-extra-parens -->
<script setup lang="ts">
const props = defineProps<{
  modelValue?: unknown
  isEditable?: boolean
  depth?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <div class="w-full">

    <!-- Text -->
    <DataSheetDetailText
      v-if="typeof model === 'string'"
      v-model="model"
    />

    <!-- Object / Recrusive -->
    <template v-else-if="typeof model === 'object' && model !== null">
      <DataSheetRow
        v-for="(value, key) in (model as Record<string, unknown>)"
        :key="key"
        :name="typeof key === 'number' ? `#${key}` : key"
        :model-value="value"
        :depth="depth"
        is-nested
      />
    </template>

    <!-- No Data -->
    <div
      v-else
      class="flex items-center py-xs px-sm">
      <span class="text-subtle italic">
        {{ t('noData') }}
      </span>
    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  noData: No data available
  linkNode: Node
  linkName: Property
fr:
  noData: Aucune donnée disponible
  linkNode: Noeud
  linkName: Propriété
de:
  noData: Keine Daten verfügbar
  linkNode: Knoten
  linkName: Eigenschaft
es:
  noData: No hay datos disponibles
  linkNode: Nodo
  linkName: Propiedad
zh:
  noData: 没有可用数据
  linkNode: 节点
  linkName: 属性
</i18n>
