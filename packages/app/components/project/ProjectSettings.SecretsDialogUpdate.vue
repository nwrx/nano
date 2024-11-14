<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
  project: string
  name: string
}>()

const emit = defineEmits<{
  'submit': [value: string]
}>()

const { t } = useI18n({ useScope: 'local' })
const isOpen = useVModel(props, 'modelValue', emit, { passive: true })
const newValue = ref('')
</script>

<template>
  <AppDialog
    v-model="isOpen"
    icon="i-carbon:label"
    class-hint="hint-warning"
    :title="t('title', { name })"
    :text="t('text', { name, workspace, project })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => emit('submit', newValue)">

    <!-- Confirmation input -->
    <InputText
      v-model="newValue"
      class="mt-2"
      :placeholder="t('placeholder')"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Update secret **{name}** value
  text: Update the value of the secret **{name}** in the project **{workspace}/{project}**. Keep in mind that all the flows using this secret will be affected by this change. Are you sure you want to proceed?
  cancel: Keep the current value
  confirm: I understand, update the value
  placeholder: Enter the new value for the secret...
fr:
  title: Mettre à jour la valeur du secret **{name}**
  text: Mettre à jour la valeur du secret **{name}** dans le projet **{workspace}/{project}**. Gardez à l'esprit que tous les flux utilisant ce secret seront affectés par ce changement. Êtes-vous sûr de vouloir continuer ?
  cancel: Conserver la valeur actuelle
  confirm: Je comprends, mettre à jour la valeur
  placeholder: Entrez la nouvelle valeur du secret...
de:
  title: Wert des Geheimnisses **{name}** aktualisieren
  text: Aktualisieren Sie den Wert des Geheimnisses **{name}** im Projekt **{workspace}/{project}**. Beachten Sie, dass alle Flows, die dieses Geheimnis verwenden, von dieser Änderung betroffen sein werden. Sind Sie sicher, dass Sie fortfahren möchten?
  cancel: Behalten Sie den aktuellen Wert bei
  confirm: Ich verstehe, aktualisieren Sie den Wert
  placeholder: Geben Sie den neuen Wert für das Geheimnis ein...
es:
  title: Actualizar el valor del secreto **{name}**
  text: Actualice el valor del secreto **{name}** en el proyecto **{workspace}/{project}**. Tenga en cuenta que todos los flujos que utilizan este secreto se verán afectados por este cambio. ¿Estás seguro de que quieres continuar?
  cancel: Mantener el valor actual
  confirm: Entiendo, actualizar el valor
  placeholder: Introduce el nuevo valor del secreto...
zh:
  title: 更新秘密 **{name}** 的值
  text: 更新工作区 **{workspace}/{project}** 中秘密 **{name}** 的值。请注意，所有使用此秘密的流程都将受到此更改的影响。您确定要继续吗？
  cancel: 保留当前值
  confirm: 我明白，更新值
  placeholder: 为秘密输入新值...
</i18n>
