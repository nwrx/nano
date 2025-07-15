<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import RunnerCard from '~/components/runner/RunnerCard.vue'

const props = defineProps<{
  modelValue?: boolean
  runner: ThreadRunnerObject
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()

async function enableRunner() {
  await client.request('PUT /api/runners/:identity/enable', {
    data: { identity: props.runner.identity },
    onSuccess: () => {
      alerts.success(t('enableSuccess', { identity: props.runner.identity }))
      emit('submit')
    },
  })
}

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
const isOpen = useVModel(props, 'modelValue', emit)
const isDisabled = computed(() => !props.runner.disabledAt)
const identity = computed(() => props.runner.identity)
</script>

<template>
  <Dialog
    v-model="isOpen"
    :icon="isDisabled ? 'i-carbon:pause' : 'i-carbon:play'"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="isDisabled ? t('disableTitle', { identity }) : t('enableTitle', { identity })"
    :text="isDisabled ? t('disableText', { identity }) : t('enableText', { identity })"
    :label-cancel="t('cancel')"
    :label-confirm="isDisabled ? t('disableConfirm') : t('enableConfirm')"
    @confirm="() => isDisabled ? disableRunner() : enableRunner()">
    <RunnerCard :runner />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  enableTitle: Enable runner
  enableText: Enable runner **{identity}** to allow it to accept and execute new threads.
  enableConfirm: Enable
  enableSuccess: Runner **{identity}** has been enabled.
  disableTitle: Disable runner
  disableText: Disable runner **{identity}** to prevent it from accepting new threads. Running threads will continue to completion.
  disableConfirm: Disable
  disableSuccess: Runner **{identity}** has been disabled.
  cancel: Cancel
fr:
  enableTitle: Activer le serveur d'exécution
  enableText: Activer le serveur d'exécution **{identity}** pour lui permettre d'accepter et d'exécuter de nouveaux threads.
  enableConfirm: Activer
  enableSuccess: Le serveur d'exécution **{identity}** a été activé.
  disableTitle: Désactiver le serveur d'exécution
  disableText: Désactiver le serveur d'exécution **{identity}** pour l'empêcher d'accepter de nouveaux threads. Les threads en cours continueront à s'exécuter jusqu'à leur achèvement.
  disableConfirm: Désactiver
  disableSuccess: Le serveur d'exécution **{identity}** a été désactivé.
  cancel: Annuler
de:
  enableTitle: Ausführungsserver aktivieren
  enableText: Aktivieren Sie den Ausführungsserver **{identity}**, um ihm zu erlauben, neue Threads zu akzeptieren und auszuführen.
  enableConfirm: Aktivieren
  enableSuccess: Ausführungsserver **{identity}** wurde aktiviert.
  disableTitle: Ausführungsserver deaktivieren
  disableText: Deaktivieren Sie den Ausführungsserver **{identity}**, um zu verhindern, dass er neue Threads akzeptiert. Laufende Threads werden bis zum Abschluss fortgesetzt.
  disableConfirm: Deaktivieren
  disableSuccess: Ausführungsserver **{identity}** wurde deaktiviert.
  cancel: Abbrechen
es:
  enableTitle: Habilitar el servidor de ejecución
  enableText: Habilitar el servidor de ejecución **{identity}** para permitirle aceptar y ejecutar nuevos hilos.
  enableConfirm: Habilitar
  enableSuccess: El servidor de ejecución **{identity}** ha sido habilitado.
  disableTitle: Deshabilitar el servidor de ejecución
  disableText: Deshabilitar el servidor de ejecución **{identity}** para evitar que acepte nuevos hilos. Los hilos en ejecución continuarán hasta su finalización.
  disableConfirm: Deshabilitar
  disableSuccess: El servidor de ejecución **{identity}** ha sido deshabilitado.
  cancel: Cancelar
zh:
  enableTitle: 启用执行服务器
  enableText: 启用执行服务器 **{identity}** 以允许其接受和执行新线程。
  enableConfirm: 启用
  enableSuccess: 执行服务器 **{identity}** 已启用。
  disableTitle: 禁用执行服务器
  disableText: 禁用执行服务器 **{identity}** 以防止其接受新线程。正在运行的线程将继续执行直到完成。
  disableConfirm: 禁用
  disableSuccess: 执行服务器 **{identity}** 已禁用。
  cancel: 取消
</i18n>
