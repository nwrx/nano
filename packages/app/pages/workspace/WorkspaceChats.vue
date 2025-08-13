<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceChat',
  path: '/:workspace/chats',
  middleware: ['redirect-when-guest', 'abort-reserved'],
  layout: 'workspace',
  icon: 'i-carbon:chat-bot',
  groups: ['nav-items-workspace'],
  title: {
    en: 'Chat',
    fr: 'Chat',
    de: 'Chat',
    es: 'Chat',
    zh: '聊天',
  },
  description: {
    en: 'Interact with your flows through a chat interface.',
    fr: 'Interagissez avec vos flux via une interface de chat.',
    de: 'Interagiere mit deinen Flows über eine Chat-Schnittstelle.',
    es: 'Interactúa con tus flujos a través de una interfaz de chat.',
    zh: '通过聊天界面与您的流进行交互。',
  },
  isWorkInProgress: true,
})

throw createError({
  name: 'E_WORK_IN_PROGRESS',
  statusCode: 503,
  statusMessage: 'Service Unavailable',
  message: 'This page is under construction. Please check back later.',
})
</script>

<template>
  <AppPageContainer contained>
    <Pattern class="h-full" />
  </AppPageContainer>
</template>
