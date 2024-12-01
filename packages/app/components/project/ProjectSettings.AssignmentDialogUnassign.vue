<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
  project: string
  title: string
  username: string
  userDisplayName: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': []
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <AppDialog
    v-model="model"
    icon="i-carbon:warning"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { userDisplayName, title })"
    :text="t('text', { userDisplayName })"
    :label-cancel="t('button.cancel')"
    :label-confirm="t('button.confirm')"
  />
</template>

<i18n lang="yaml">
en:
  title: Unassign **{userDisplayName}** from the **{title}** project
  text: You are about to unassign **{userDisplayName}** from the project. This means they will lose access to the project and their related resources. Keep in mind that this also includes the API keys that are associated with the given user.
  button.cancel: Keep the user assigned
  button.confirm: I understand, unassign the user
fr:
  title: Désassigner **{userDisplayName}** du projet **{title}**
  text: Vous êtes sur le point de désassigner **{userDisplayName}** du projet. Cela signifie qu'ils perdront l'accès au projet et à ses ressources associées. Gardez à l'esprit que cela inclut également les clés API associées à l'utilisateur donné.
  button.cancel: Garder l'utilisateur assigné
  button.confirm: Je comprends, désassigner l'utilisateur
de:
  title: '**{userDisplayName}** vom Projekt **{title}** entfernen'
  text: Sie sind dabei, **{userDisplayName}** aus dem Projekt zu entfernen. Dies bedeutet, dass sie den Zugriff auf das Projekt und die damit verbundenen Ressourcen verlieren. Beachten Sie, dass dies auch die API-Schlüssel umfasst, die mit dem angegebenen Benutzer verknüpft sind.
  button.cancel: Benutzer zugewiesen lassen
  button.confirm: Ich verstehe, den Benutzer nicht zuweisen
es:
  title: Desasignar a **{userDisplayName}** del proyecto **{title}**
  text: Estás a punto de desasignar a **{userDisplayName}** del proyecto. Esto significa que perderán el acceso al proyecto y sus recursos relacionados. Ten en cuenta que esto también incluye las claves de API asociadas al usuario dado.
  button.cancel: Mantener al usuario asignado
  button.confirm: Entiendo, desasignar al usuario
zh:
  title: 将 **{userDisplayName}** 从项目 **{title}** 中取消分配
  text: 您即将将 **{userDisplayName}** 从项目中取消分配。这意味着他们将失去对项目及其相关资源的访问权限。请注意，这也包括与给定用户关联的 API 密钥。
  button.cancel: 保留用户分配
  button.confirm: 我明白，取消分配用户
</i18n>
