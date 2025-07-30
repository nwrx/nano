<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import { useFlow } from '~/composables/useFlow'
import FlowCard from './FlowCard.vue'

const props = defineProps<{
  workspace: string
  project: string
  name: string
}>()

// --- State.
const { t } = useI18n()
const { removeFlow } = useFlow(props)
const isOpen = defineModel({ default: false })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:trash-can"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { workspace, project, name })"
    :text="t('text', { workspace, project, name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => removeFlow()">

    <!-- Confirm input -->
    <FlowCard
      v-if="isOpen"
      :workspace="workspace"
      :project="project"
      :name="name"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Confirm deletion of the **{name}** flow.
  text: This action **cannot be undone**. To confirm deletion, please type the exact flow name below. Keep in mind that this will delete all data associated with the flow.
  cancel: Cancel
  confirm: Delete the flow
  confirmLabel: Confirm deletion by typing the name of the flow
fr:
  title: Confirmer la suppression du flux **{name}**.
  text: Cette action **ne peut pas être annulée**. Pour confirmer la suppression, veuillez saisir le nom exact du flux ci-dessous. N'oubliez pas que cela supprimera toutes les données associées au flux.
  cancel: Annuler
  confirm: Supprimer le flux
  confirmLabel: Confirmez la suppression en tapant le nom du flux
de:
  title: Löschung des Flusses **{name}** bestätigen.
  text: Diese Aktion **kann nicht rückgängig gemacht werden**. Um die Löschung zu bestätigen, geben Sie bitte den genauen Flow-Namen unten ein. Beachten Sie, dass dadurch alle mit dem Flow verbundenen Daten gelöscht werden.
  cancel: Abbrechen
  confirm: Flow löschen
  confirmLabel: Bestätigen Sie die Löschung durch Eingabe des Flow-Namens
es:
  title: Confirmar eliminación del flujo **{name}**.
  text: Esta acción **no se puede deshacer**. Para confirmar la eliminación, escriba el nombre exacto del flujo a continuación. Tenga en cuenta que esto eliminará todos los datos asociados con el flujo.
  cancel: Cancelar
  confirm: Eliminar el flujo
  confirmLabel: Confirme la eliminación escribiendo el nombre del flujo
zh:
  title: 确认删除 **{name}** 流程。
  text: 此操作**无法撤销**。要确认删除，请在下方输入流程的确切名称。请注意，这将删除与该流程相关的所有数据。
  cancel: 取消
  confirm: 删除流程
  confirmLabel: 通过输入流程名称确认删除
</i18n>
