<script setup lang="ts">
defineProps<{
  name?: string
}>()

const emit = defineEmits<{
  archive: []
  delete: []
}>()

const { t } = useI18n()

const isDialogShareOpen = ref(false)
// const isDialogArchiveOpen = ref(false)
</script>

<template>
  <div @mousedown.stop>
    <ContextMenu x="left" y="bottom">
      <template #default="{ open }">
        <BaseIcon
          icon="i-carbon:overflow-menu-vertical"
          class="size-5"
          @mousedown="() => open()"
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
        <ContextMenuItem
          :label="t('menu.delete')"
          icon="i-carbon:trash-can"
          @click="() => emit('delete')"
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
  menu.delete: Delete
fr:
  menu.rename: Renommer
  menu.archive: Archiver
  menu.share: Partager
  menu.delete: Supprimer
de:
  menu.rename: Umbenennen
  menu.archive: Archivieren
  menu.share: Teilen
  menu.delete: Löschen
es:
  menu.rename: Renombrar
  menu.archive: Archivar
  menu.share: Compartir
  menu.delete: Eliminar
zh:
  menu.rename: 重命名
  menu.archive: 存档
  menu.share: 分享
  menu.delete: 删除
</i18n>
