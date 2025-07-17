<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import { useIconCollection } from '~/composables/useIcon'
import IconCollectionCard from './IconCollectionCard.vue'

const props = defineProps<{
  name: string
}>()

// --- State.
const { t } = useI18n()
const isOpen = defineModel({ default: false })
const collection = useIconCollection(props)
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
    @confirm="() => collection.uninstallCollection()">

    <!-- Collection card -->
    <IconCollectionCard
      v-if="isOpen"
      :name="name"
      class="mb-4"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Uninstall collection **{name}**
  text: Permanently remove icon collection **{name}** and all its icons from the system. This action cannot be undone.
  cancel: Cancel
  confirm: Uninstall Collection
fr:
  title: Désinstaller la collection **{name}**
  text: Supprimer définitivement la collection d'icônes **{name}** et toutes ses icônes du système. Cette action ne peut pas être annulée.
  cancel: Annuler
  confirm: Désinstaller la Collection
de:
  title: Sammlung **{name}** deinstallieren
  text: Entfernen Sie die Icon-Sammlung **{name}** und alle ihre Icons dauerhaft aus dem System. Diese Aktion kann nicht rückgängig gemacht werden.
  cancel: Abbrechen
  confirm: Sammlung Deinstallieren
es:
  title: Desinstalar colección **{name}**
  text: Eliminar permanentemente la colección de iconos **{name}** y todos sus iconos del sistema. Esta acción no se puede deshacer.
  cancel: Cancelar
  confirm: Desinstalar Colección
zh:
  title: 卸载集合 **{name}**
  text: 永久从系统中删除图标集合 **{name}** 及其所有图标。此操作无法撤消。
  cancel: 取消
  confirm: 卸载集合
</i18n>
