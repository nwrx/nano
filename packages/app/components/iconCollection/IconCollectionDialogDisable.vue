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
    icon="i-carbon:pause"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { name })"
    :text="t('text', { name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => collection.disableCollection()">

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
  title: Disable collection **{name}**
  text: Temporarily deactivate icon collection **{name}** to prevent it from being used. Icons from this collection will no longer be available in the interface.
  cancel: Cancel
  confirm: Disable Collection
fr:
  title: Désactiver la collection **{name}**
  text: Désactiver temporairement la collection d'icônes **{name}** pour empêcher son utilisation. Les icônes de cette collection ne seront plus disponibles dans l'interface.
  cancel: Annuler
  confirm: Désactiver la Collection
de:
  title: Sammlung **{name}** deaktivieren
  text: Deaktivieren Sie die Icon-Sammlung **{name}** vorübergehend, um ihre Verwendung zu verhindern. Icons aus dieser Sammlung werden in der Benutzeroberfläche nicht mehr verfügbar sein.
  cancel: Abbrechen
  confirm: Sammlung Deaktivieren
es:
  title: Deshabilitar colección **{name}**
  text: Desactivar temporalmente la colección de iconos **{name}** para prevenir su uso. Los iconos de esta colección ya no estarán disponibles en la interfaz.
  cancel: Cancelar
  confirm: Deshabilitar Colección
zh:
  title: 禁用集合 **{name}**
  text: 临时停用图标集合 **{name}** 以防止其被使用。此集合中的图标将不再在界面中可用。
  cancel: 取消
  confirm: 禁用集合
</i18n>
