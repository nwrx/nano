<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  workspace?: string
  username?: string
  displayName?: string
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
    :title="t('title', { username, workspace })"
    :text="t('text', { username, workspace })"
    :label-cancel="t('button.cancel')"
    :label-confirm="t('button.confirm')">
    <UserCard :display-name="displayName" :username="username" />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Unassign **{username}** from **{workspace}** workspace
  text: You are about to unassign **{username}** from the workspace. This means they will lose access to all projects in this workspace. This action cannot be undone.
  button.cancel: Keep the user assigned
  button.confirm: I understand, unassign the user
</i18n>
