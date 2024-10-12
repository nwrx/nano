<script setup lang="ts">
defineProps<{
  email?: string
  avatarUrl?: string
  displayName?: string
}>()

const emit = defineEmits<{
  signout: []
}>()
</script>

<template>
  <ContextMenu x="right" y="below" @mouseleave="">

    <template #default="{ open, toggle }">
      <AppNavFab
        @mouseenter="() => open()"
        @click="() => toggle()">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="User Avatar"
          class="size-6 rounded-full cursor-pointer"
        />
      </AppNavFab>
    </template>

    <!-- Menu -->
    <template #menu="{ close }">
      <div class="flex items-center space-x-md pb-sm">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="User Avatar"
          class="size-10 rounded-full"
        />
        <div class="text-sm font-medium">
          <p class="text-sm truncate text-app">{{ displayName }}</p>
          <p class="text-sm truncate text-subtle">{{ email }}</p>
        </div>
      </div>
      <ContextMenuDivider />
      <ContextMenuItem
        label="Profile"
        icon="i-carbon:user"
        :to="{ name: 'UserSettingsProfile' }"
        @click="() => close()"
      />
      <ContextMenuItem
        label="Account"
        icon="i-carbon:settings"
        :to="{ name: 'UserSettingsAccount' }"
        @click="() => close()"
      />
      <ContextMenuItem
        label="Help"
        icon="i-carbon:help"
        @click="() => close()"
      />
      <ContextMenuDivider />
      <ContextMenuItem
        label="Sign out"
        icon="i-carbon:logout"
        @click="() => { emit('signout'); close() }"
      />
    </template>
  </ContextMenu>
</template>
