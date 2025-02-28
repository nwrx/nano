<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const session = useEditor()
</script>

<template>
  <div class="flex items-center space-x-sm px-sm h-12 rd bg-editor-panel border border-editor backdrop-blur-2xl ">

    <!-- Name -->
    <h1 class="text-base line-clamp-1 ml-sm select-text">
      {{ session.data.name }}
    </h1>

    <!-- Favorite -->
    <!--
      <EditorFab
      :icon="isBookmarked ? 'i-carbon:bookmark-add' : 'i-carbon:bookmark'"
      @click="() => emit('bookmark')"
      />
    -->

    <!-- Divider -->
    <div class="h-full border-r border-editor" />

    <!-- Settings -->
    <EditorFab icon="i-carbon:settings" />

    <!-- Export -->
    <EditorFab
      icon="i-carbon:download"
      @click="() => emit('download')"
    />

    <!-- Start -->
    <Tooltip
      :message="t('startFlow')"
      size="md"
      position="bottom"
      variant="primary">
      <EditorFab
        :is-active="isRunning"
        :icon="isRunning ? 'i-line-md:loading-loop' : 'i-carbon:play'"
        @click="() => isRunning ? emit('abort') : emit('start')"
      />
    </Tooltip>

    <!-- Chat -->
    <EditorFab
      icon="i-carbon:chat-bot"
      @click="() => router.push(`${route.fullPath}/chat`)"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  startFlow: Start the flow
fr:
  startFlow: Activer le flux
de:
  startFlow: Starten Sie den Fluss
es:
  startFlow: Iniciar el flujo
zh:
  startFlow: 启动流程
</i18n>
