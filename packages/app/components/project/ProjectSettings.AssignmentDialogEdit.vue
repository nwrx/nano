<script setup lang="ts">
import type { WorkspaceProjectPermission } from '@nwrx/api'

const props = defineProps<{
  modelValue: boolean
  userDisplayName?: string
  permissions?: WorkspaceProjectPermission[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [value: WorkspaceProjectPermission[]]
}>()

const model = useVModel(props, 'modelValue', emit, { passive: true })
const role = ref<WorkspaceProjectPermission>('Read')
const access = ref<WorkspaceProjectPermission[]>([])

watch(() => props.permissions, (permissions) => {
  if (!permissions) return
  role.value = permissions.find(x => ['Read', 'Write', 'Owner'].includes(x)) ?? 'Read'
  access.value = permissions.filter(x => !['Read', 'Write', 'Owner'].includes(x))
}, { immediate: true })
</script>

<template>
  <AppDialog v-model="model" :title="`Manage project access for ${userDisplayName}`">
    <AppPageHint type="error">
      Members with the <b>Owner</b> role have full access to the project, including
      the ability to manage the project settings and members of the project. Be careful when assigning
      this role to a team member.
    </AppPageHint>

    <div class="space-y-4 mt-8">
      <AppDialogToggle
        v-model="role"
        value="Owner"
        label="Owner"
        text="Gives full access to the project, including the ability to manage members."
        type="radio"
      />
      <AppDialogToggle
        v-model="role"
        value="Write"
        label="Editor"
        text="Can access and edit the project settings and the flows."
        type="radio"
      />
      <AppDialogToggle
        v-model="role"
        label="Member"
        value="Read"
        text="Can view the project, flows, and the variables but cannot edit them."
        type="radio"
      />
    </div>

    <!-- Access -->
    <div class="space-y-4 mt-8 pt-8 border-t border-black/10">
      <AppDialogToggle
        v-model="access"
        value="WriteVariables"
        label="Variables"
        text="Can view and edit the variables of the project."
        type="checkbox"
      />
      <AppDialogToggle
        v-model="access"
        value="WriteSecrets"
        label="Secrets"
        text="Can edit the secrets of the project."
        type="checkbox"
      />
      <AppDialogToggle
        v-model="access"
        value="WriteApiKeys"
        label="API Keys"
        text="Can create API keys to access the project from external services."
        type="checkbox"
      />
    </div>

    <!-- Confirm -->
    <template #cta="{ close }">
      <AppDialogActions
        labelConfirm="Confirm"
        @close="() => close()"
        @confirm="() => emit('submit', [role, ...access])"
      />
    </template>
  </AppDialog>
</template>
