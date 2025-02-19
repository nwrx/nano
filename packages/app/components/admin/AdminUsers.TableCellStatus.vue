<script setup lang="ts">
defineProps<{
  username: string
  displayName: string
  avatarUrl: string
  createdAt?: string
  lastSeenAt?: string
  disabledAt?: string
}>()

// --- Define emits.
const emit = defineEmits<{
  submitImpersonate: []
  submitVerify: []
  submitDisable: []
  submitEnable: []
  submitDelete: []
}>()

// --- Load i18n instance.
const { t, locale } = useI18n()

// --- Dialog states.
const isDialogDeleteOpen = ref(false)
const isDialogDisableOpen = ref(false)
const isDialogEnableOpen = ref(false)
const isDialogVerifyOpen = ref(false)
const isDialogImpersonateOpen = ref(false)
</script>

<template>
  <div class="flex items-center space-x-sm font-normal relative w-full">

    <!-- Creation Date -->
    <div :key="locale" class="lt-md:hidden">
      <p class="text-sm text-app">
        {{ t('lastSeen', { distance: formatDateFromNow(lastSeenAt) }) }}
      </p>
      <p class="text-xs text-subtle">
        {{ t('createdAt', { date: formatDate(createdAt) }) }}
      </p>
    </div>

    <!-- Spacer -->
    <div class="grow" />

    <!-- Context Menu -->
    <ContextMenu x="right" y="top" @mousedown.stop>
      <template #menu>
        <ContextMenuItem
          :label="t('menu.impersonate')"
          icon="i-carbon:login"
          @click="() => isDialogImpersonateOpen = true"
        />
        <ContextMenuItem
          :label="t('menu.verify')"
          icon="i-carbon:checkmark-outline"
          @click="() => isDialogVerifyOpen = true"
        />
        <ContextMenuDivider />
        <ContextMenuItem
          v-if="!disabledAt"
          :label="t('menu.disable')"
          icon="i-carbon:close"
          @click="() => isDialogDisableOpen = true"
        />
        <ContextMenuItem
          v-if="disabledAt"
          :label="t('menu.enable')"
          icon="i-carbon:checkmark"
          @click="() => isDialogEnableOpen = true"
        />
        <ContextMenuItem
          :label="t('menu.delete')"
          icon="i-carbon:trash-can"
          @click="() => isDialogDeleteOpen = true"
        />
      </template>
    </ContextMenu>

    <!-- Dialog Delete -->
    <AdminUsersDeleteDialog
      v-model="isDialogDeleteOpen"
      :username="username"
      :display-name="displayName"
      @submit="() => emit('submitDelete')"
    />

    <!-- Disable Dialog -->
    <AdminUsersDialogDisable
      v-model="isDialogDisableOpen"
      :username="username"
      :display-name="displayName"
      @submit="() => emit('submitDisable')"
    />

    <!-- Enable Dialog -->
    <AdminUsersDialogEnable
      v-model="isDialogEnableOpen"
      :username="username"
      :display-name="displayName"
      @submit="() => emit('submitEnable')"
    />

    <!-- Verify Dialog -->
    <AdminUsersDialogVerify
      v-model="isDialogVerifyOpen"
      :username="username"
      :display-name="displayName"
      @submit="() => emit('submitVerify')"
    />

    <!-- Impersonate Dialog -->
    <AdminUsersDialogImpersonate
      v-model="isDialogImpersonateOpen"
      :username="username"
      :display-name="displayName"
      @submit="() => emit('submitImpersonate')"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  createdAt: Created at {date}
  lastSeen: Last seen {distance}
  menu.impersonate: Impersonate
  menu.verify: Verify
  menu.disable: Disable
  menu.enable: Enable
  menu.delete: Delete
fr:
  createdAt: Créé le {date}
  lastSeen: Dernière connexion {distance}
  menu.impersonate: Usurper
  menu.verify: Vérifier
  menu.disable: Désactiver
  menu.enable: Activer
  menu.delete: Supprimer
de:
  createdAt: Erstellt am {date}
  lastSeen: Zuletzt gesehen {distance}
  menu.impersonate: Nachahmen
  menu.verify: Überprüfen
  menu.disable: Deaktivieren
  menu.enable: Aktivieren
  menu.delete: Löschen
es:
  createdAt: Creado en {date}
  lastSeen: Última vez visto {distance}
  menu.impersonate: Suplantar
  menu.verify: Verificar
  menu.disable: Deshabilitar
  menu.enable: Habilitar
  menu.delete: Borrar
zh:
  createdAt: 创建于 {date}
  lastSeen: 上次查看 {distance}
  menu.impersonate: 模仿
  menu.verify: 验证
  menu.disable: 禁用
  menu.enable: 启用
  menu.delete: 删除
</i18n>
