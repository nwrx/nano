<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceChat',
  path: '/:workspace/chat/:id?',
  middleware: ['redirect-when-guest', 'abort-reserved'],
})

const { t } = useI18n()
const route = useRoute()
const workspaceName = computed(() => route.params.workspace as string)
// const searchParameters = useUrlSearchParams()

const chat = useChat(workspaceName)
const workspace = useWorkspace(workspaceName, {
  withFlows: true,
})

useHead(() => ({
  title: t('title'),
  meta: [
    { title: 'description', content: t('description') },
  ],
}))

onMounted(async() => {
  await workspace.refresh()
  await chat.refresh()
  await chat.channel
})
</script>

<template>
  <AppPage>
    <ProjectHeader
      icon="i-carbon:chat-bot"
      :title="t('title')"
      :workspace="workspaceName"
      :description="t('description')"
    />
    <Chat
      :projects="workspace.data.value"
      :thread="chat.thread"
      :threads="chat.threads.value"
      @send-message="(message) => chat.sendMessage(message)"
      @create-thread="(project, flow) => chat.createThread(project, flow)"
      @open-thread="(id) => chat.openThread(id)"
      @delete-thread="(id) => chat.deleteThread(id)"
    />
  </AppPage>
</template>

<i18n lang="yaml">
en:
  title: Chat
  description: Interact with your flows through a chat interface.
fr:
  title: Chat
  description: Interagissez avec vos flux via une interface de chat.
de:
  title: Chat
  description: Interagiere mit deinen Flows über eine Chat-Schnittstelle.
es:
  title: Chat
  description: Interactúa con tus flujos a través de una interfaz de chat.
zh:
  title: 聊天
  description: 通过聊天界面与您的流进行交互。
</i18n>
