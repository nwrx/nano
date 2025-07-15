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

async function enableRunner() {
  await client.request('PUT /api/runners/:identity/enable', {
    data: { identity: props.runner.identity },
    onSuccess: () => {
      alerts.success(t('enableSuccess', { identity: props.runner.identity }))
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
    icon="i-carbon:play"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('enableTitle', { identity })"
    :text="t('enableText', { identity })"
    :label-cancel="t('cancel')"
    :label-confirm="t('enableConfirm')"
    @confirm="() => enableRunner()">
    <RunnerCard :runner />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  enableTitle: Enable runner
  enableText: Enable runner **{identity}** to allow it to accept and execute new threads.
  enableConfirm: Enable
  enableSuccess: Runner **{identity}** has been enabled.
  cancel: Cancel
fr:
  enableTitle: Activer le serveur d'exécution
  enableText: Activer le serveur d'exécution **{identity}** pour lui permettre d'accepter et d'exécuter de nouveaux threads.
  enableConfirm: Activer
  enableSuccess: Le serveur d'exécution **{identity}** a été activé.
  cancel: Annuler
de:
  enableTitle: Ausführungsserver aktivieren
  enableText: Aktivieren Sie den Ausführungsserver **{identity}**, um ihm zu erlauben, neue Threads zu akzeptieren und auszuführen.
  enableConfirm: Aktivieren
  enableSuccess: Ausführungsserver **{identity}** wurde aktiviert.
  cancel: Abbrechen
es:
  enableTitle: Habilitar el servidor de ejecución
  enableText: Habilitar el servidor de ejecución **{identity}** para permitirle aceptar y ejecutar nuevos hilos.
  enableConfirm: Habilitar
  enableSuccess: El servidor de ejecución **{identity}** ha sido habilitado.
  cancel: Cancelar
zh:
  enableTitle: 启用执行服务器
  enableText: 启用执行服务器 **{identity}** 以允许其接受和执行新线程。
  enableConfirm: 启用
  enableSuccess: 执行服务器 **{identity}** 已启用。
  cancel: 取消
</i18n>
