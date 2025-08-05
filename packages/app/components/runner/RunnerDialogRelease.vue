<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import { useRunner } from '~/composables/useRunner'
import RunnerCard from './RunnerCard.vue'

const props = defineProps<{ name: string }>()

const { t } = useI18n()
const confirm = ref('')
const isOpen = defineModel({ default: false })
const runner = useRunner(props)

onMounted(() => {
  void runner.fetch()
})
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:trash-can"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { name })"
    :text="t('text', { name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirm !== name"
    @confirm="() => runner.remove()">

    <!-- Card -->
    <RunnerCard
      :runner="runner.data"
      class="mb-md"
    />

    <!-- Confirm -->
    <InputText
      v-model="confirm"
      :label="t('label')"
      :placeholder="name"
    />

  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Release runner
  text: Permanently remove runner **{name}** from the system. This action cannot be undone and will terminate any running threads.
  label: Type the runner name to confirm
  cancel: Cancel
  confirm: Release
  success: Runner **{name}** has been released.
fr:
  title: Libérer le serveur d'exécution
  text: Supprimer définitivement le serveur d'exécution **{name}** du système. Cette action est irréversible et mettra fin à tous les threads en cours.
  label: Tapez l'identité du serveur d'exécution pour confirmer
  cancel: Annuler
  confirm: Libérer
  success: Le serveur d'exécution **{name}** a été libéré.
de:
  title: Ausführungsserver freigeben
  text: Entfernen Sie den Ausführungsserver **{name}** dauerhaft aus dem System. Diese Aktion kann nicht rückgängig gemacht werden und beendet alle laufenden Threads.
  label: Geben Sie die Ausführungsserver-Identität zur Bestätigung ein
  cancel: Abbrechen
  confirm: Freigeben
  success: Ausführungsserver **{name}** wurde freigegeben.
es:
  title: Liberar el servidor de ejecución
  text: Eliminar permanentemente el servidor de ejecución **{name}** del sistema. Esta acción no se puede deshacer y finalizará cualquier hilo en ejecución.
  label: Escribe la identidad del servidor de ejecución para confirmar
  cancel: Cancelar
  confirm: Liberar
  success: El servidor de ejecución **{name}** ha sido liberado.
zh:
  title: 释放执行服务器
  text: 永久从系统中移除执行服务器 **{name}**。此操作无法撤销，并将终止所有正在运行的线程。
  label: 输入执行服务器标识以确认
  cancel: 取消
  confirm: 释放
  success: 执行服务器 **{name}** 已被释放。
</i18n>
