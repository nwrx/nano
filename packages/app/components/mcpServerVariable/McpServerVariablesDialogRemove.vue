<script setup lang="ts">
import type { McpServerVariableObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import McpServerVariableCard from '~/components/mcpServerVariable/McpServerVariableCard.vue'
import { useMcpServerVariables } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
  variable: McpServerVariableObject
}>()

// --- Model.
const { t } = useI18n()
const variables = useMcpServerVariables(props)
const isOpen = defineModel({ default: false })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:delete"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { name: variable.name, server: name })"
    :text="t('text')"
    :label-confirm="t('confirm')"
    :label-cancel="t('cancel')"
    @confirm="() => variables.removeVariable(variable.name)">

    <McpServerVariableCard :variable="variable" />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Remove variable **{name}** from server **{server}**
  text: Are you sure you want to remove this environment variable? This action cannot be undone and may affect the server's functionality.
  confirm: Remove variable
  cancel: Cancel
fr:
  title: Supprimer la variable **{name}** du serveur **{server}**
  text: Êtes-vous sûr de vouloir supprimer cette variable d'environnement ? Cette action ne peut pas être annulée et peut affecter le fonctionnement du serveur.
  confirm: Supprimer la variable
  cancel: Annuler
de:
  title: Variable **{name}** vom Server **{server}** entfernen
  text: Sind Sie sicher, dass Sie diese Umgebungsvariable entfernen möchten? Diese Aktion kann nicht rückgängig gemacht werden und kann die Funktionalität des Servers beeinträchtigen.
  confirm: Variable entfernen
  cancel: Abbrechen
es:
  title: Eliminar variable **{name}** del servidor **{server}**
  text: ¿Está seguro de que desea eliminar esta variable de entorno? Esta acción no se puede deshacer y puede afectar la funcionalidad del servidor.
  confirm: Eliminar variable
  cancel: Cancelar
zh:
  title: 从服务器 **{server}** 删除变量 **{name}**
  text: 您确定要删除此环境变量吗？此操作无法撤消，可能会影响服务器的功能。
  confirm: 删除变量
  cancel: 取消
</i18n>
