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
const { duplicateFlow } = useFlow(props)
const rename = ref('')
const isOpen = defineModel({ default: false })
watch(isOpen, () => { rename.value = `${props.name}-copy` }, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:copy"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('title', { workspace, project, name })"
    :text="t('text', { workspace, project, name })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="!name"
    @confirm="() => duplicateFlow(name)">

    <!-- Input for new flow name -->
    <InputText
      v-model="rename"
      class="mt-2"
      :label="t('nameLabel')"
      :placeholder="t('namePlaceholder')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Duplicate the **{name}** flow
  text: Create a copy of this flow with a new name. The duplicated flow will contain all the same nodes and configuration as the original.
  cancel: Cancel
  confirm: Duplicate
  nameLabel: Name for the duplicated flow
  namePlaceholder: Enter name for the copy
fr:
  title: Dupliquer le flux **{name}**
  text: Créer une copie de ce flux avec un nouveau nom. Le flux dupliqué contiendra tous les mêmes nœuds et la même configuration que l'original.
  cancel: Annuler
  confirm: Dupliquer
  nameLabel: Nom pour le flux dupliqué
  namePlaceholder: Entrez le nom de la copie
de:
  title: Flow **{name}** duplizieren
  text: Erstellen Sie eine Kopie dieses Flows mit einem neuen Namen. Der duplizierte Flow enthält alle gleichen Knoten und Konfigurationen wie das Original.
  cancel: Abbrechen
  confirm: Duplizieren
  nameLabel: Name für den duplizierten Flow
  namePlaceholder: Namen für die Kopie eingeben
es:
  title: Duplicar el flujo **{name}**
  text: Crear una copia de este flujo con un nuevo nombre. El flujo duplicado contendrá todos los mismos nodos y configuración que el original.
  cancel: Cancelar
  confirm: Duplicar
  nameLabel: Nombre para el flujo duplicado
  namePlaceholder: Ingrese el nombre de la copia
zh:
  title: 复制 **{name}** 流程
  text: 使用新名称创建此流程的副本。复制的流程将包含与原始流程相同的所有节点和配置。
  cancel: 取消
  confirm: 复制
  nameLabel: 复制流程的名称
  namePlaceholder: 输入副本的名称
</i18n>
