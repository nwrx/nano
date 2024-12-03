<script setup lang="ts">
defineProps<{
  name?: string
}>()

const emit = defineEmits<{
  archive: []
}>()

const { t } = useI18n()

const isDialogShareOpen = ref(false)
// const isDialogArchiveOpen = ref(false)
</script>

<template>
  <div>
    <ContextMenu x="left" y="bottom">
      <template #default="{ open }">
        <BaseIcon
          icon="i-carbon:overflow-menu-vertical"
          class="size-5"
          @click="() => open()"
        />
      </template>
      <template #menu="{ close }">
        <ContextMenuItem
          :label="t('menu.rename')"
          icon="i-carbon:edit"
          @click="() => { console.log('slt') }"
        />
        <ContextMenuItem
          :label="t('menu.archive')"
          icon="i-carbon:archive"
          @click="() => { emit('archive'); close() }"
        />
        <ContextMenuItem
          :label="t('menu.share')"
          icon="i-carbon:copy"
          @click="() => isDialogShareOpen = true"
        />
      </template>
    </ContextMenu>

    <!-- Share -->
    <ChatPanelThreadDialogShare
      v-model="isDialogShareOpen"
      :name="name"
      url="https://example.com"
    />

    <!-- Archive -->
    <!--
      <ChatPanelThreadDialogArchive
      v-model="isDialogArchiveOpen"
      :name="name"
      />
    -->
  </div>
</template>

<i18n lang="yaml">
en:
  menu.rename: Rename
  menu.archive: Archive
  menu.share: Share
fr:
  menu.rename: Renommer
  menu.archive: Archiver
  menu.share: Partager
de:
  menu.rename: Umbenennen
  menu.archive: Archivieren
  menu.share: Teilen
es:
  menu.rename: Renombrar
  menu.archive: Archivar
  menu.share: Compartir
zh:
  menu.rename: 重命名
  menu.archive: 存档
  menu.share: 分享
</i18n>
