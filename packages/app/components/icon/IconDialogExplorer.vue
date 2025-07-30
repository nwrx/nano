<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import IconExplorer from './IconExplorer.vue'

const props = defineProps<{
  icon?: string
}>()

const emit = defineEmits<{
  'submit': [icon: string]
}>()

const { t } = useI18n()
const isOpen = defineModel({ default: false })
const selectedIcon = ref<string>()

// Reset selected icon when dialog opens
watch(isOpen, () => {
  if (!isOpen.value) return
  selectedIcon.value = props.icon
})

function confirmSelection() {
  if (selectedIcon.value) {
    emit('submit', selectedIcon.value)
    isOpen.value = false
  }
}
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:image-search"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('title')"
    :text="t('text')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="!selectedIcon"
    @confirm="() => confirmSelection()">

    <!-- Explorer -->
    <IconExplorer v-model="selectedIcon" is-dark />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Select an icon
  text: Choose an icon from the available collection. You can search for specific icons using the search field.
  cancel: Cancel
  confirm: Select icon
fr:
  title: Sélectionner une icône
  text: Choisissez une icône parmi la collection disponible. Vous pouvez rechercher des icônes spécifiques en utilisant le champ de recherche.
  cancel: Annuler
  confirm: Sélectionner l'icône
de:
  title: Symbol auswählen
  text: Wählen Sie ein Symbol aus der verfügbaren Sammlung. Sie können mit dem Suchfeld nach bestimmten Symbolen suchen.
  cancel: Abbrechen
  confirm: Symbol auswählen
es:
  title: Seleccionar un icono
  text: Elige un icono de la colección disponible. Puedes buscar iconos específicos usando el campo de búsqueda.
  cancel: Cancelar
  confirm: Seleccionar icono
zh:
  title: 选择图标
  text: 从可用集合中选择图标。您可以使用搜索字段搜索特定图标。
  cancel: 取消
  confirm: 选择图标
</i18n>
