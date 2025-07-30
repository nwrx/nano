<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import { useFlow } from '~/composables/useFlow'

const props = defineProps<{
  workspace: string
  project: string
  name: string
}>()

// --- State.
const { t } = useI18n()
const { renameFlow } = useFlow(props)
const rename = ref('')
const isOpen = defineModel({ default: false })
watch(isOpen, () => { rename.value = props.name }, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:label"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { workspace, project, name })"
    :text="t('text', { workspace, project, name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => renameFlow(rename)">

    <!-- Input for new flow name -->
    <InputText
      v-model="rename"
      class="mt-2"
      :placeholder="t('nameLabel')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Rename the **{project}/{name}** flow
  text: Renaming your flow will update its identifier. Make sure to update any references to this flow in your project.
  cancel: Cancel
  confirm: Rename
  nameLabel: Enter new flow name
fr:
  title: Renommer le flux **{project}/{name}**
  text: Le renommage de votre flux mettra à jour son identifiant. Assurez-vous de mettre à jour toutes les références à ce flux dans votre projet.
  cancel: Annuler
  confirm: Renommer
  nameLabel: Saisissez le nouveau nom du flux
de:
  title: Flux **{project}/{name}** umbenennen
  text: Die Umbenennung Ihres Flusses aktualisiert dessen Kennung. Stellen Sie sicher, dass Sie alle Verweise auf diesen Fluss in Ihrem Projekt aktualisieren.
  cancel: Abbrechen
  confirm: Umbenennen
  nameLabel: Neuen Flow-Namen eingeben
es:
  title: Renombrar el flujo **{project}/{name}**
  text: Renombrar su flujo actualizará su identificador. Asegúrese de actualizar cualquier referencia a este flujo en su proyecto.
  cancel: Cancelar
  confirm: Renombrar
  nameLabel: Ingrese el nuevo nombre del flujo
zh:
  title: 重命名 **{project}/{name}** 流程
  text: 重命名流程将更新其标识符。请确保更新项目中对此流程的任何引用。
  cancel: 取消
  confirm: 重命名
  nameLabel: 输入新的流程名称
</i18n>
