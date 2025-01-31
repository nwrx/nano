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
  <ContextMenu x="right" y="below">

    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      alt="User Avatar"
      class="w-8 h-8 rounded-full cursor-pointer"
    />

    <!-- Menu -->
    <template #menu="{ close }">
      <div class="flex items-center space-x-4 pb-2">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="User Avatar"
          class="w-10 h-10 rounded-full"
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
