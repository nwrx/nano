<script setup lang="ts">
defineProps<{
  email?: string
  username?: string
  displayName?: string
}>()

const emit = defineEmits<{
  signout: []
}>()

const isOpen = ref(false)
</script>

<template>
  <ContextMenu
    v-model="isOpen"
    x="right"
    y="below"
    @mouseenter="() => isOpen = true"
    @mouseleave="() => isOpen = false">

    <AppNavFab>
      <UserAvatar
        :username="username"
        class="size-6 rounded-full cursor-pointer"
      />
    </AppNavFab>

    <!-- Menu -->
    <template #menu="{ close }">
      <div class="flex items-center space-x-md pb-sm w-48">
        <UserAvatar
          :username="username"
          class="size-6 rounded-full cursor-pointer"
        />
        <div class="truncate">
          <p class="text-sm truncate text-app" v-text="displayName || username" />
          <p class="text-sm truncate text-subtle" v-text="email" />
        </div>
      </div>
      <ContextMenuDivider />
      <ContextMenuItem
        label="Account"
        icon="i-carbon:settings"
        :to="{ name: 'UserSettings' }"
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
