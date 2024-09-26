<script setup lang="ts">
defineProps<{
  imageUrl?: string
}>()

const emit = defineEmits<{
  signout: []
}>()
</script>

<template>
  <ContextMenu x="right" y="below">

    <img
      v-if="imageUrl"
      :src="imageUrl"
      alt="User Avatar"
      class="w-8 h-8 rounded-full cursor-pointer"
    />

    <!-- Menu -->
    <template #menu="{ close }">
      <ContextMenuItem
        label="Profile"
        icon="i-carbon:user"
        :to="{ name: 'UserSettings' }"
        @click="() => close()"
      />
      <ContextMenuItem
        label="Settings"
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
