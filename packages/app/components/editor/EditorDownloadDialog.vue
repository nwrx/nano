<script setup lang="ts">
import type { FlowObject } from '@nwrx/nano-api'
import { vCode } from '~/utils/vCode'
import EditorDialogButton from './EditorDialog.Button.vue'
import EditorDialog from './EditorDialog.vue'

const props = defineProps<{
  flow: FlowObject
  requestExport: (format: 'json' | 'yaml') => Promise<string>
}>()

const { t } = useI18n()
const alerts = useAlerts()
const show = defineModel({ default: false })
const data = ref<string>('')
const format = ref<'json' | 'yaml'>('yaml')
const isLoading = ref(false)

async function refreshFlowExport() {
  if (!props.requestExport) return
  isLoading.value = true
  data.value = await props.requestExport(format.value)
  isLoading.value = false
}

function copyToClipboard() {
  if (!navigator.clipboard) return
  if (!data.value) return
  navigator.clipboard.writeText(data.value)
    .then(() => alerts.success(t('copySuccess')))
    .catch(() => alerts.error(t('copyError')))
}

function downloadFlow() {
  if (!data.value) return
  const name = props.flow?.name ?? 'flow'
  const type = format.value === 'json' ? 'application/json' : 'text/yaml'
  const blob = new Blob([data.value], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.${format.value}`
  a.click()
  URL.revokeObjectURL(url)
}

watch([show, format], () => {
  if (!show.value) return
  void refreshFlowExport()
})
</script>

<template>
  <EditorDialog
    v-model="show"
    :title="t('title')"
    :description="t('description')">

    <!-- Content -->
    <div
      v-code.yaml="data"
      class="w-full font-mono overflow-y-auto select-text"
    />

    <!-- Menu -->
    <template #menu>
      <EditorDialogButton
        class="b-r b-app"
        :label="format.toUpperCase()"
        @click="() => format = format === 'json' ? 'yaml' : 'json'"
      />
      <EditorDialogButton
        icon="i-carbon:copy"
        @click="() => copyToClipboard()"
      />
      <EditorDialogButton
        icon="i-carbon:download"
        @click="() => downloadFlow()"
      />
    </template>
  </EditorDialog>
</template>

<i18n lang="yaml">
en:
  title: Export Flow
  description: Serialized representation of the flow. Can be used to import the flow into another project.
  copySuccess: Flow copied to clipboard.
  copyError: Failed to copy flow to clipboard.
fr:
  title: Exporter le flux
  description: Représentation sérialisée du flux. Peut être utilisé pour importer le flux dans un autre projet.
  copySuccess: Flux copié dans le presse-papiers.
  copyError: Échec de la copie du flux dans le presse-papiers.
de:
  title: Exportieren des Flusses
  description: Serialisierte Darstellung des Flusses. Kann verwendet werden, um den Fluss in ein anderes Projekt zu importieren.
  copySuccess: Fluss in die Zwischenablage kopiert.
  copyError: Fehler beim Kopieren des Flusses in die Zwischenablage.
es:
  title: Exportar flujo
  description: Representación serializada del flujo. Puede usarse para importar el flujo en otro proyecto.
  copySuccess: Flujo copiado al portapapeles.
  copyError: Error al copiar el flujo al portapapeles.
zh:
  title: 导出流程
  description: 流程的序列化表示。可用于将流程导入到另一个项目中。
  copySuccess: 流程已复制到剪贴板。
  copyError: 无法将流程复制到剪贴板。
</i18n>
