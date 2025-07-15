<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import RunnerCard from '~/components/runner/RunnerCard.vue'

const props = defineProps<{
  runner: ThreadRunnerObject
}>()

const emit = defineEmits<{
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()

async function disableRunner() {
  await client.request('PUT /api/runners/:identity/disable', {
    data: { identity: props.runner.identity },
    onSuccess: () => {
      alerts.success(t('disableSuccess', { identity: props.runner.identity }))
      emit('submit')
    },
  })
}

// --- State.
const isOpen = defineModel({ default: false })
const identity = computed(() => props.runner.identity)
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:pause"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('disableTitle', { identity })"
    :text="t('disableText', { identity })"
    :label-cancel="t('cancel')"
    :label-confirm="t('disableConfirm')"
    @confirm="() => disableRunner()">
    <RunnerCard :runner />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  disableTitle: Disable runner
  disableText: Disable runner **{identity}** to prevent it from accepting new threads. Running threads will continue to completion.
  disableConfirm: Disable
  disableSuccess: Runner **{identity}** has been disabled.
  cancel: Cancel
fr:
  disableTitle: Désactiver le serveur d'exécution
  disableText: Désactiver le serveur d'exécution **{identity}** pour l'empêcher d'accepter de nouveaux threads. Les threads en cours continueront à s'exécuter jusqu'à leur achèvement.
  disableConfirm: Désactiver
  disableSuccess: Le serveur d'exécution **{identity}** a été désactivé.
  cancel: Annuler
de:
  disableTitle: Ausführungsserver deaktivieren
  disableText: Deaktivieren Sie den Ausführungsserver **{identity}**, um zu verhindern, dass er neue Threads akzeptiert. Laufende Threads werden bis zum Abschluss fortgesetzt.
  disableConfirm: Deaktivieren
  disableSuccess: Ausführungsserver **{identity}** wurde deaktiviert.
  cancel: Abbrechen
es:
  disableTitle: Deshabilitar el servidor de ejecución
  disableText: Deshabilitar el servidor de ejecución **{identity}** para evitar que acepte nuevos hilos. Los hilos en ejecución continuarán hasta su finalización.
  disableConfirm: Deshabilitar
  disableSuccess: El servidor de ejecución **{identity}** ha sido deshabilitado.
  cancel: Cancelar
zh:
  disableTitle: 禁用执行服务器
  disableText: 禁用执行服务器 **{identity}** 以防止其接受新线程。正在运行的线程将继续执行直到完成。
  disableConfirm: 禁用
  disableSuccess: 执行服务器 **{identity}** 已禁用。
  cancel: 取消
</i18n>
