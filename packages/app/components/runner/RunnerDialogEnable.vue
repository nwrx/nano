<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import RunnerCard from '~/components/runner/RunnerCard.vue'
import { useRunner } from '~/composables/useRunner'

const props = defineProps<{
  name: string
}>()

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
    icon="i-carbon:play"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('enableTitle', { name })"
    :text="t('enableText', { name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('enableConfirm')"
    @confirm="() => runner.enable()">
    <RunnerCard :runner="runner.data" />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  enableTitle: Enable runner
  enableText: Enable runner **{name}** to allow it to accept and execute new threads.
  enableConfirm: Enable
  enableSuccess: Runner **{name}** has been enabled.
  cancel: Cancel
fr:
  enableTitle: Activer le serveur d'exécution
  enableText: Activer le serveur d'exécution **{name}** pour lui permettre d'accepter et d'exécuter de nouveaux threads.
  enableConfirm: Activer
  enableSuccess: Le serveur d'exécution **{name}** a été activé.
  cancel: Annuler
de:
  enableTitle: Ausführungsserver aktivieren
  enableText: Aktivieren Sie den Ausführungsserver **{name}**, um ihm zu erlauben, neue Threads zu akzeptieren und auszuführen.
  enableConfirm: Aktivieren
  enableSuccess: Ausführungsserver **{name}** wurde aktiviert.
  cancel: Abbrechen
es:
  enableTitle: Habilitar el servidor de ejecución
  enableText: Habilitar el servidor de ejecución **{name}** para permitirle aceptar y ejecutar nuevos hilos.
  enableConfirm: Habilitar
  enableSuccess: El servidor de ejecución **{name}** ha sido habilitado.
  cancel: Cancelar
zh:
  enableTitle: 启用执行服务器
  enableText: 启用执行服务器 **{name}** 以允许其接受和执行新线程。
  enableConfirm: 启用
  enableSuccess: 执行服务器 **{name}** 已启用。
  cancel: 取消
</i18n>
