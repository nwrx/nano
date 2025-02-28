<script setup lang="ts">
import type { WorkspacePermission } from '@nwrx/nano-api'

const props = defineProps<{
  modelValue: boolean
  workspace: string
  username: string
  displayName: string
  permissions: WorkspacePermission[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [value: WorkspacePermission[]]
}>()

const model = useVModel(props, 'modelValue', emit, { passive: true })
const role = ref<WorkspacePermission>('Read')
const access = ref<WorkspacePermission[]>([])

const { t } = useI18n()

watch(() => props.permissions, (permissions) => {
  if (!permissions) return
  role.value = permissions.find(x => ['Read', 'Write', 'Owner'].includes(x)) ?? 'Read'
  access.value = permissions.filter(x => !['Read', 'Write', 'Owner'].includes(x))
}, { immediate: true })
</script>

<template>
  <AppDialog
    v-model="model"
    icon="i-carbon:label"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { workspace, username })"
    :text="t('text', { workspace, username })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => emit('submit', [role, ...access])">

    <div class="space-y-4">
      <AppDialogToggle
        v-model="role"
        value="Owner"
        :label="t('owner.label')"
        :text="t('owner.text')"
        type="radio"
      />
      <AppDialogToggle
        v-model="role"
        value="Write"
        :label="t('editor.label')"
        :text="t('editor.text')"
        type="radio"
      />
      <AppDialogToggle
        v-model="role"
        value="Read"
        :label="t('member.label')"
        :text="t('member.text')"
        type="radio"
      />
    </div>
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Manage workspace access for **{username}** in **{workspace}**
  text: Members with the **Owner** role have full access to the workspace, including the ability to manage workspace settings and members. Be careful when assigning this role.
  owner.label: Owner
  owner.text: Full access to workspace settings and member management
  editor.label: Editor
  editor.text: Can edit workspace settings but cannot manage members
  member.label: Member
  member.text: Can view workspace settings but cannot edit them
  confirm: Apply permissions
  cancel: Keep current permissions
</i18n>
