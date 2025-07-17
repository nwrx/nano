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
    icon="i-carbon:play"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('title', { name })"
    :text="t('text', { name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => collection.enableCollection()">

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
  title: Enable collection **{name}**
  text: Activate icon collection **{name}** to make it available for use. Icons from this collection will become available in the interface.
  cancel: Cancel
  confirm: Enable Collection
fr:
  title: Activer la collection **{name}**
  text: Activer la collection d'icônes **{name}** pour la rendre disponible à l'utilisation. Les icônes de cette collection deviendront disponibles dans l'interface.
  cancel: Annuler
  confirm: Activer la Collection
de:
  title: Sammlung **{name}** aktivieren
  text: Aktivieren Sie die Icon-Sammlung **{name}**, um sie für die Verwendung verfügbar zu machen. Icons aus dieser Sammlung werden in der Benutzeroberfläche verfügbar.
  cancel: Abbrechen
  confirm: Sammlung Aktivieren
es:
  title: Habilitar colección **{name}**
  text: Activar la colección de iconos **{name}** para que esté disponible para su uso. Los iconos de esta colección estarán disponibles en la interfaz.
  cancel: Cancelar
  confirm: Habilitar Colección
zh:
  title: 启用集合 **{name}**
  text: 激活图标集合 **{name}** 以使其可用。此集合中的图标将在界面中可用。
  cancel: 取消
  confirm: 启用集合
</i18n>
