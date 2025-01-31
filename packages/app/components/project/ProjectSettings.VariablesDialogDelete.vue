<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
  project: string
  name: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

const { t } = useI18n()
const alerts = useAlerts()
const isOpen = useVModel(props, 'modelValue', emit, { passive: true })
const confirm = ref('')

function submit() {
  if (confirm.value === props.name) emit('submit')
  else alerts.error(t('error'))
}
</script>

<template>
  <AppDialog
    v-model="isOpen"
    icon="i-carbon:label"
    class-hint="hint-danger"
    :title="t('title')"
    :text="t('text', { workspace, project })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"

    @confirm="() => submit()">

    <!-- Confirmation input -->
    <InputText
      v-model="confirm"
      :label="t('message')"
      :placeholder="name"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Delete variable
  text: Are you sure you want to delete this variable from the project **{workspace}/{project}**? Make sure you understand that all the flows using this variable will be affected by this change.
  cancel: Keep the variable
  confirm: I understand, delete the variable
  message: Please type the variable name to confirm
  error: The variable name does not match. Please try again.
fr:
  title: Supprimer la variable
  text: Êtes-vous sûr de vouloir supprimer cette variable du projet **{workspace}/{project}** ? Assurez-vous de comprendre que tous les flux utilisant cette variable seront affectés par ce changement.
  cancel: Conserver la variable
  confirm: Je comprends, supprimer la variable
  message: Veuillez taper le nom de la variable pour confirmer
  error: Le nom de la variable ne correspond pas. Veuillez réessayer.
de:
  title: Variable löschen
  text: Sind Sie sicher, dass Sie diese Variable aus dem Projekt **{workspace}/{project}** löschen möchten? Stellen Sie sicher, dass Sie verstehen, dass alle Flows, die diese Variable verwenden, von dieser Änderung betroffen sein werden.
  cancel: Variable behalten
  confirm: Ich verstehe, die Variable löschen
  message: Bitte geben Sie den Variablennamen zur Bestätigung ein
  error: Der Variablenname stimmt nicht überein. Bitte versuchen Sie es erneut.
es:
  title: Eliminar variable
  text: ¿Estás seguro de que quieres eliminar esta variable del proyecto **{workspace}/{project}**? Asegúrate de entender que todos los flujos que utilizan esta variable se verán afectados por este cambio.
  cancel: Mantener la variable
  confirm: Entiendo, eliminar la variable
  message: Por favor, escribe el nombre de la variable para confirmar
  error: El nombre de la variable no coincide. Por favor, inténtalo de nuevo.
zh:
  title: 删除变量
  text: 您确定要从工作区 **{workspace}/{project}** 中删除此变量吗？请确保您了解，所有使用此变量的流程都将受到此更改的影响。
  cancel: 保留变量
  confirm: 我明白，删除变量
  message: 请键入变量名称以确认
  error: 变量名称不匹配。请重试。
</i18n>
