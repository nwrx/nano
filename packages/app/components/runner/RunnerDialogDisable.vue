<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import RunnerCard from '~/components/runner/RunnerCard.vue'
import { useRunner } from '~/composables/useRunner'

const props = defineProps<{
  name: string
}>()

// --- Model.
const { t } = useI18n()
const runner = useRunner(props)
const isOpen = defineModel({ default: false })

onMounted(() => {
  void runner.fetch()
})
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:pause"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('disableTitle', { name })"
    :text="t('disableText', { name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('disableConfirm')"
    @confirm="() => runner.disable()">
    <RunnerCard :runner="runner.data" />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  disableTitle: Disable runner
  disableText: Disable runner **{name}** to prevent it from accepting new threads. Running threads will continue to completion.
  disableConfirm: Disable
  disableSuccess: Runner **{name}** has been disabled.
  cancel: Cancel
fr:
  disableTitle: Désactiver le serveur d'exécution
  disableText: Désactiver le serveur d'exécution **{name}** pour l'empêcher d'accepter de nouveaux threads. Les threads en cours continueront à s'exécuter jusqu'à leur achèvement.
  disableConfirm: Désactiver
  disableSuccess: Le serveur d'exécution **{name}** a été désactivé.
  cancel: Annuler
de:
  disableTitle: Ausführungsserver deaktivieren
  disableText: Deaktivieren Sie den Ausführungsserver **{name}**, um zu verhindern, dass er neue Threads akzeptiert. Laufende Threads werden bis zum Abschluss fortgesetzt.
  disableConfirm: Deaktivieren
  disableSuccess: Ausführungsserver **{name}** wurde deaktiviert.
  cancel: Abbrechen
es:
  disableTitle: Deshabilitar el servidor de ejecución
  disableText: Deshabilitar el servidor de ejecución **{name}** para evitar que acepte nuevos hilos. Los hilos en ejecución continuarán hasta su finalización.
  disableConfirm: Deshabilitar
  disableSuccess: El servidor de ejecución **{name}** ha sido deshabilitado.
  cancel: Cancelar
zh:
  disableTitle: 禁用执行服务器
  disableText: 禁用执行服务器 **{name}** 以防止其接受新线程。正在运行的线程将继续执行直到完成。
  disableConfirm: 禁用
  disableSuccess: 执行服务器 **{name}** 已禁用。
  cancel: 取消
</i18n>
