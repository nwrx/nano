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
    icon="i-carbon:download"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('title', { name })"
    :text="t('text', { name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => void collection.installCollection()">

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
  title: Install collection **{name}**
  text: Download and install icon collection **{name}** to make it available for use. Icons from this collection will become available in the interface.
  cancel: Cancel
  confirm: Install Collection
fr:
  title: Installer la collection **{name}**
  text: Télécharger et installer la collection d'icônes **{name}** pour la rendre disponible à l'utilisation. Les icônes de cette collection deviendront disponibles dans l'interface.
  cancel: Annuler
  confirm: Installer la Collection
de:
  title: Sammlung **{name}** installieren
  text: Laden Sie die Icon-Sammlung **{name}** herunter und installieren Sie sie, um sie für die Verwendung verfügbar zu machen. Icons aus dieser Sammlung werden in der Benutzeroberfläche verfügbar.
  cancel: Abbrechen
  confirm: Sammlung Installieren
es:
  title: Instalar colección **{name}**
  text: Descargar e instalar la colección de iconos **{name}** para que esté disponible para su uso. Los iconos de esta colección estarán disponibles en la interfaz.
  cancel: Cancelar
  confirm: Instalar Colección
zh:
  title: 安装集合 **{name}**
  text: 下载并安装图标集合 **{name}** 以使其可用。此集合中的图标将在界面中可用。
  cancel: 取消
  confirm: 安装集合
</i18n>
