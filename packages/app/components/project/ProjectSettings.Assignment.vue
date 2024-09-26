<script setup lang="ts">
import type { WorkspaceProjectPermission } from '@nwrx/api'

const props = defineProps<{
  modelValue: string[]
  userName: string
  userDisplayName: string
  permissions: WorkspaceProjectPermission[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  submit: [value: WorkspaceProjectPermission[]]
}>()

const isDialogManageOpen = ref(false)
const isDialogUnassignOpen = ref(false)
const model = useVModel(props, 'modelValue', emit, { passive: true })
const permissions = useVModel(props, 'permissions', emit, { passive: true })
</script>

<template>
  <div class="hover:bg-primary-50 border-b border-black/10">
    <div class="flex items-center justify-start space-x-4 py-4 px-8">

      <BaseInputToggle
        v-model="model"
        :value="userName"
        type="checkbox"
      />

      <!-- Image -->
      <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
        <BaseIcon icon="i-carbon:user" class="w-6 h-6" />
      </div>

      <div class="text-sm grow">
        <Button link variant="primary">{{ userDisplayName }}</Button>
        <p class="text-sm">{{ userName }}</p>
      </div>

      <!-- Access -->
      <div class="flex items-center justify-end space-x-2">
        <Badge
          v-if="permissions?.includes('WriteVariables')"
          icon="i-carbon:label"
          variant="primary"
          size="xsmall"
          light
        />
        <Badge
          v-if="permissions?.includes('WriteSecrets')"
          icon="i-carbon:password"
          variant="primary"
          size="xsmall"
          light
        />
        <Badge
          v-if="permissions?.includes('WriteApiKeys')"
          icon="i-carbon:api-key"
          variant="primary"
          size="xsmall"
          light
        />
        <Badge
          v-if="permissions?.includes('Owner')"
          icon="i-carbon:user-certification"
          label="Owner"
          size="xsmall"
          variant="primary"
          outlined
        />
        <Badge
          v-else-if="permissions?.includes('Write')"
          icon="i-carbon:edit"
          label="Edit"
          size="xsmall"
          variant="primary"
          filled
        />
        <Badge
          v-else-if="permissions?.includes('Read')"
          icon="i-carbon:view"
          label="View"
          size="xsmall"
          variant="primary"
        />
      </div>

      <ContextMenu x="right" y="top">
        <template #menu>
          <ContextMenuItem
            icon="i-carbon:edit"
            label="Manage"
            keybind="Ctrl + E"
            :disabled="disabled"
            @click="() => isDialogManageOpen = true"
          />
          <ContextMenuItem
            icon="i-carbon:user"
            label="Profile"
            keybind="Ctrl + P"
          />
          <ContextMenuItem
            icon="i-carbon:delete"
            label="Unassign"
            keybind="Backspace"
            :disabled="disabled"
            @click="() => isDialogUnassignOpen = true"
          />
        </template>
      </ContextMenu>
    </div>

    <!-- Manage Dialog -->
    <ProjectSettingsAssignmentDialogEdit
      v-model="isDialogManageOpen"
      :userDisplayName="userDisplayName"
      :permissions="permissions"
      @submit="value => emit('submit', value)"
    />

    <!-- Unassign Dialog -->
    <ProjectSettingsAssignmentDialogUnassign
      v-model="isDialogUnassignOpen"
      :userName="userName"
      :userDisplayName="userDisplayName"
      @submit="() => emit('submit', [])"
    />
  </div>
</template>
