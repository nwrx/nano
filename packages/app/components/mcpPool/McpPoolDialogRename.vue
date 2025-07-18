<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import { useMcpPool } from '~/composables/useMcp'
import McpPoolCard from './McpPoolCard.vue'

const props = defineProps<{
  workspace: string
  name: string
}>()

// --- Model.
const { t } = useI18n()
const pool = useMcpPool(props)
const newName = ref('')
const isOpen = defineModel({ default: false })
watch(isOpen, () => newName.value = props.name, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-hint="hint-warning"
    class-button="button-warning"
    icon="i-carbon:edit"
    :title="t('title')"
    :text="t('text', { name })"
    :label-cancel="t('cancel')"
    :label-submit="t('rename')"
    @submit="() => pool.renamePool(newName)">

    <!-- Pool Card -->
    <McpPoolCard
      :workspace="workspace"
      :name="name"
      class="mb-md"
    />

    <!-- New Name Input -->
    <InputText
      v-model="newName"
      :label="t('newName')"
      :placeholder="t('newNamePlaceholder')"
      :hint="t('newNameHint')"
      required
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Rename Pool
  text: Enter a new name for the pool **{name}**. This will update the pool identifier and may affect routing.
  cancel: Cancel
  rename: Rename Pool
  newName: New Pool Name
  newNamePlaceholder: Enter new pool name
  newNameHint: The new name must be unique within the workspace
fr:
  title: Renommer le pool
  text: Entrez un nouveau nom pour le pool **{name}**. Cela mettra à jour l'identifiant du pool et peut affecter le routage.
  cancel: Annuler
  rename: Renommer le pool
  newName: Nouveau nom du pool
  newNamePlaceholder: Entrez le nouveau nom du pool
  newNameHint: Le nouveau nom doit être unique dans l'espace de travail
de:
  title: Pool umbenennen
  text: Geben Sie einen neuen Namen für den Pool **{name}** ein. Dies wird die Pool-ID aktualisieren und kann das Routing beeinflussen.
  cancel: Abbrechen
  rename: Pool umbenennen
  newName: Neuer Pool-Name
  newNamePlaceholder: Neuen Pool-Namen eingeben
  newNameHint: Der neue Name muss innerhalb des Arbeitsbereichs eindeutig sein
es:
  title: Renombrar pool
  text: Ingrese un nuevo nombre para el pool **{name}**. Esto actualizará el identificador del pool y puede afectar el enrutamiento.
  cancel: Cancelar
  rename: Renombrar pool
  newName: Nuevo nombre del pool
  newNamePlaceholder: Ingrese el nuevo nombre del pool
  newNameHint: El nuevo nombre debe ser único dentro del espacio de trabajo
zh:
  title: 重命名池
  text: 为池 **{name}** 输入新名称。这将更新池标识符并可能影响路由。
  cancel: 取消
  rename: 重命名池
  newName: 新池名称
  newNamePlaceholder: 输入新池名称
  newNameHint: 新名称在工作区内必须是唯一的
</i18n>
