<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'

defineProps<{ user: UserObject }>()
const emit = defineEmits<{ 'submit': [] }>()

const { t } = useI18n()
const showImpersonate = ref(false)
const showVerify = ref(false)
const showDisable = ref(false)
const showEnable = ref(false)
const showDelete = ref(false)
</script>

<template>
  <ContextMenu x="right" y="top" @mousedown.stop>
    <template #menu>
      <ContextMenuItem
        :label="t('menu.impersonate')"
        icon="i-carbon:login"
        @click="() => showImpersonate = true"
      />
      <ContextMenuItem
        :label="t('menu.verify')"
        icon="i-carbon:checkmark-outline"
        @click="() => showVerify = true"
      />
      <ContextMenuDivider />
      <ContextMenuItem
        v-if="!user.disabledAt"
        :label="t('menu.disable')"
        icon="i-carbon:close"
        @click="() => showDisable = true"
      />
      <ContextMenuItem
        v-if="user.disabledAt"
        :label="t('menu.enable')"
        icon="i-carbon:checkmark"
        @click="() => showEnable = true"
      />
      <ContextMenuItem
        :label="t('menu.delete')"
        icon="i-carbon:trash-can"
        @click="() => showDelete = true"
      />
    </template>
  </ContextMenu>

  <!-- Impersonate Dialog -->
  <AdminSettingsUsersDialogImpersonate
    v-model="showImpersonate"
    :user="user"
  />

  <!-- Delete Dialog -->
  <AdminSettingsUsersDialogDelete
    v-model="showDelete"
    :user="user"
    @submit="() => emit('submit')"
  />

  <!-- Disable Dialog -->
  <AdminSettingsUsersDialogDisable
    v-model="showDisable"
    :user="user"
    @submit="() => emit('submit')"
  />

  <!-- Enable Dialog -->
  <AdminSettingsUsersDialogEnable
    v-model="showEnable"
    :user="user"
    @submit="() => emit('submit')"
  />

  <!-- Verify Dialog -->
  <AdminSettingsUsersDialogVerify
    v-model="showVerify"
    :user="user"
    @submit="() => emit('submit')"
  />
</template>
