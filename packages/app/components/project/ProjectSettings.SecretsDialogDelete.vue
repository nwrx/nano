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
  title: Delete secret
  text: Are you sure you want to delete this secret from the project **{workspace}/{project}**? Make sure you understand that all the flows using this secret will be affected by this change.
  cancel: Keep the secret
  confirm: I understand, delete the secret
  message: Please type the secret name to confirm
  error: The secret name does not match. Please try again.
fr:
  title: Supprimer le secret
  text: Êtes-vous sûr de vouloir supprimer ce secret du projet **{workspace}/{project}** ? Assurez-vous de comprendre que tous les flux utilisant ce secret seront affectés par ce changement.
  cancel: Conserver le secret
  confirm: Je comprends, supprimer le secret
  message: Veuillez taper le nom du secret pour confirmer
  error: Le nom du secret ne correspond pas. Veuillez réessayer.
de:
  title: Geheimnis löschen
  text: Sind Sie sicher, dass Sie dieses Geheimnis aus dem Projekt **{workspace}/{project}** löschen möchten? Stellen Sie sicher, dass Sie verstehen, dass alle Flows, die dieses Geheimnis verwenden, von dieser Änderung betroffen sein werden.
  cancel: Geheimnis behalten
  confirm: Ich verstehe, das Geheimnis löschen
  message: Bitte geben Sie den Geheimnisnamen zur Bestätigung ein
  error: Der Geheimnisname stimmt nicht überein. Bitte versuchen Sie es erneut.
es:
  title: Eliminar secreto
  text: ¿Estás seguro de que quieres eliminar este secreto del proyecto **{workspace}/{project}**? Asegúrate de entender que todos los flujos que utilizan este secreto se verán afectados por este cambio.
  cancel: Mantener el secreto
  confirm: Entiendo, eliminar el secreto
  message: Por favor, escribe el nombre del secreto para confirmar
  error: El nombre del secreto no coincide. Por favor, inténtalo de nuevo.
zh:
  title: 删除秘密
  text: 您确定要从工作区 **{workspace}/{project}** 中删除此秘密吗？请确保您了解，所有使用此秘密的流程都将受到此更改的影响。
  cancel: 保留秘密
  confirm: 我明白，删除秘密
  message: 请键入秘密名称以确认
  error: 秘密名称不匹配。请重试。
</i18n>
