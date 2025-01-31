<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
  project: string
  value: string
  name: string
}>()

const emit = defineEmits<{
  'submit': [value: string]
}>()

const { t } = useI18n()
const isOpen = useVModel(props, 'modelValue', emit, { passive: true })
const newValue = ref('')

watch(isOpen, (value) => {
  if (value) newValue.value = props.value
})
</script>

<template>
  <AppDialog
    v-model="isOpen"
    icon="i-carbon:label"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { name })"
    :text="t('text', { name, workspace, project })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => emit('submit', newValue)">

    <!-- Confirmation input -->
    <InputText
      v-model="newValue"
      type="textarea"
      class="mt-2 font-mono"
      :placeholder="t('placeholder')"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Update variable **{name}** value
  text: Update the value of the variable **{name}** in the project **{workspace}/{project}**. Keep in mind that all the flows using this variable will be affected by this change. Are you sure you want to proceed?
  cancel: Keep the current value
  confirm: I understand, update the value
  placeholder: Enter the new value for the variable...
fr:
  title: Mettre à jour la valeur de la variable **{name}**
  text: Mettre à jour la valeur de la variable **{name}** dans le projet **{workspace}/{project}**. Gardez à l'esprit que tous les flux utilisant cette variable seront affectés par ce changement. Êtes-vous sûr de vouloir continuer ?
  cancel: Conserver la valeur actuelle
  confirm: Je comprends, mettre à jour la valeur
  placeholder: Entrez la nouvelle valeur de la variable...
de:
  title: Wert der Variablen **{name}** aktualisieren
  text: Aktualisieren Sie den Wert der Variablen **{name}** im Projekt **{workspace}/{project}**. Beachten Sie, dass alle Flows, die diese Variable verwenden, von dieser Änderung betroffen sein werden. Sind Sie sicher, dass Sie fortfahren möchten?
  cancel: Behalten Sie den aktuellen Wert bei
  confirm: Ich verstehe, aktualisieren Sie den Wert
  placeholder: Geben Sie den neuen Wert für die Variable ein...
es:
  title: Actualizar el valor de la variable **{name}**
  text: Actualice el valor de la variable **{name}** en el proyecto **{workspace}/{project}**. Tenga en cuenta que todos los flujos que utilizan esta variable se verán afectados por este cambio. ¿Estás seguro de que quieres continuar?
  cancel: Mantener el valor actual
  confirm: Entiendo, actualizar el valor
  placeholder: Introduce el nuevo valor de la variable...
zh:
  title: 更新变量 **{name}** 的值
  text: 更新工作区 **{workspace}/{project}** 中变量 **{name}** 的值。请注意，所有使用此变量的流程都将受到此更改的影响。您确定要继续吗？
  cancel: 保留当前值
  confirm: 我明白，更新值
  placeholder: 为变量输入新值...
</i18n>
