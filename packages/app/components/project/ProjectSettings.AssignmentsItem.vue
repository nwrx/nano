<script setup lang="ts">
import type { WorkspaceProjectPermission } from '@nwrx/api'

const props = defineProps<{
  modelValue: string[]
  workspace: string
  project: string
  title: string
  username: string
  userDisplayName: string
  userAvatarUrl: string
  permissions: WorkspaceProjectPermission[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  submit: [value: WorkspaceProjectPermission[]]
}>()

const isDialogManageOpen = ref(false)
const isDialogUnassignOpen = ref(false)

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
const permissions = useVModel(props, 'permissions', emit, { passive: true })
</script>

<template>
  <div class="hover:bg-primary-50 border-b border-app">
    <div class="flex items-center justify-start space-x-4 py-4 px-8">

      <!-- Select -->
      <BaseInputToggle
        v-model="model"
        :value="username"
        type="checkbox"
      />

      <!-- Image -->
      <img :src="userAvatarUrl" class="w-12 h12 rounded-full">

      <div class="text-sm grow">
        <Button link variant="primary">
          {{ userDisplayName }}
        </Button>
        <p class="text-sm">
          {{ username }}
        </p>
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
          :label="t('permission.owner')"
          size="xsmall"
          variant="primary"
          outlined
        />
        <Badge
          v-else-if="permissions?.includes('Write')"
          icon="i-carbon:edit"
          :label="t('permission.write')"
          size="xsmall"
          variant="primary"
          filled
        />
        <Badge
          v-else-if="permissions?.includes('Read')"
          icon="i-carbon:view"
          :label="t('permission.read')"
          size="xsmall"
          variant="primary"
        />
      </div>

      <ContextMenu x="right" y="top">
        <template #menu>
          <ContextMenuItem
            icon="i-carbon:edit"
            :label="t('menu.manage')"
            keybind="Ctrl + E"
            :disabled="disabled"
            @click="() => isDialogManageOpen = true"
          />
          <ContextMenuItem
            icon="i-carbon:user"
            :label="t('menu.profile')"
            keybind="Ctrl + P"
          />
          <ContextMenuItem
            icon="i-carbon:delete"
            :label="t('menu.unassign')"
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
      :user-display-name="userDisplayName"
      :permissions="permissions"
      @submit="value => emit('submit', value)"
    />

    <!-- Unassign Dialog -->
    <ProjectSettingsAssignmentDialogUnassign
      v-model="isDialogUnassignOpen"
      :workspace="workspace"
      :project="project"
      :title="title"
      :username="username"
      :user-display-name="userDisplayName"
      @submit="() => emit('submit', [])"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  menu.manage: Manage
  menu.profile: Profile
  menu.unassign: Unassign
  permission.write: Write
  permission.read: Read
  permission.owner: Owner
fr:
  menu.manage: Gérer
  menu.profile: Profil
  menu.unassign: Désassigner
  permission.write: Écrire
  permission.read: Lire
  permission.owner: Propriétaire
de:
  menu.manage: Verwalten
  menu.profile: Profil
  menu.unassign: Entfernen
  permission.write: Schreiben
  permission.read: Lesen
  permission.owner: Besitzer
es:
  menu.manage: Administrar
  menu.profile: Perfil
  menu.unassign: Desasignar
  permission.write: Escribir
  permission.read: Leer
  permission.owner: Propietario
zh:
  menu.manage: 管理
  menu.profile: 档案
  menu.unassign: 取消分配
  permission.write: 写
  permission.read: 读
  permission.owner: 所有者
</i18n>
