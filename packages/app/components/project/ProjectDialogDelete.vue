<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import { useProject } from '~/composables/useProject'

const props = defineProps<{
  workspace: string
  project: string
}>()

// --- State.
const { t } = useI18n()
const { removeProject } = useProject(props)
const confirm = ref('')
const isOpen = defineModel({ default: false })
watch(isOpen, () => confirm.value = '')
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:trash-can"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { workspace, project })"
    :text="t('text', { workspace, project })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirm !== project"
    @confirm="() => removeProject()">

    <!-- Conform input -->
    <InputText
      v-model="confirm"
      :text-before="`${CONSTANTS.appHost}/${workspace}/`"
      :label="t('confirmLabel')"
      :placeholder="project"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Confirm deletion of the **{workspace}/{project}** project.
  text: This action **cannot be undone**. To confirm deletion, please type the exact project name below. Keep in mind that this will delete all data associated with the project.
  cancel: Cancel
  confirm: Delete the project
  confirmLabel: Confirm deletion by typing the name of the project
  success: Project **{workspace}/{project}** has been deleted.
fr:
  title: Confirmer la suppression du projet **{workspace}/{project}**.
  text: Cette action **ne peut pas être annulée**. Pour confirmer la suppression, veuillez saisir le nom exact du projet ci-dessous. N'oubliez pas que cela supprimera toutes les données associées au projet.
  cancel: Annuler
  confirm: Supprimer le projet
  confirmLabel: Confirmez la suppression en tapant le nom du projet
  success: Le projet **{workspace}/{project}** a été supprimé.
de:
  title: Löschung des Projekts **{workspace}/{project}** bestätigen.
  text: Diese Aktion **kann nicht rückgängig gemacht werden**. Um die Löschung zu bestätigen, geben Sie bitte den genauen Projektnamen unten ein. Beachten Sie, dass dadurch alle mit dem Projekt verbundenen Daten gelöscht werden.
  cancel: Abbrechen
  confirm: Projekt löschen
  confirmLabel: Bestätigen Sie die Löschung durch Eingabe des Projektnamens
  success: Projekt **{workspace}/{project}** wurde gelöscht.
es:
  title: Confirmar eliminación del proyecto **{workspace}/{project}**.
  text: Esta acción **no se puede deshacer**. Para confirmar la eliminación, escriba el nombre exacto del proyecto a continuación. Tenga en cuenta que esto eliminará todos los datos asociados con el proyecto.
  cancel: Cancelar
  confirm: Eliminar el proyecto
  confirmLabel: Confirme la eliminación escribiendo el nombre del proyecto
  success: El proyecto **{workspace}/{project}** ha sido eliminado.
zh:
  title: 确认删除 **{workspace}/{project}** 项目。
  text: 此操作**无法撤销**。要确认删除，请在下方输入项目的确切名称。请注意，这将删除与该项目相关的所有数据。
  cancel: 取消
  confirm: 删除项目
  confirmLabel: 通过输入项目名称确认删除
  success: 项目 **{workspace}/{project}** 已被删除。
</i18n>
