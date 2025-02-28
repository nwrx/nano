<script setup lang="ts">
defineProps<{
  workspace: string
}>()

const emit = defineEmits<{
  'submitName': [name: string]
  'submitArchive': []
}>()

const { t } = useI18n()
const showArchiveModal = ref(false)
const showRenameModal = ref(false)
</script>

<template>
  <AppPageForm :title="t('title')" class="!border-red-500/20">
    <!-- Text -->
    <template #text>
      <I18nT keypath="text">
        <template #newline>
          <br><br>
        </template>
        <template #guide>
          <Hyperlink
            :to="CONSTANTS.appCanonicalUrl"
            :label="t('text.guide')"
          />
        </template>
      </I18nT>
    </template>

    <!-- Actions -->
    <AppPageFormActions class="border-danger">
      <AppPageFormAction
        class="border-danger"
        class-button="button-danger"
        icon="i-carbon:archive"
        :title="t('action.archive.title')"
        :text="t('action.archive.text')"
        :label="t('action.archive.label')"
        @click="() => showArchiveModal = true"
      />
      <AppPageFormAction
        class="border-danger"
        class-button="button-danger"
        icon="i-carbon:edit"
        :title="t('action.rename.title')"
        :text="t('action.rename.text')"
        :label="t('action.rename.label')"
        @click="() => showRenameModal = true"
      />
    </AppPageFormActions>

    <!-- Archive Modal -->
    <WorkspaceSettingsDangerZoneDialogArchive
      v-model="showArchiveModal"
      :workspace="workspace"
      @submit="() => emit('submitArchive')"
    />

    <!-- Rename Modal -->
    <WorkspaceSettingsDangerZoneDialogRename
      v-model="showRenameModal"
      :workspace="workspace"
      @submit="(name) => emit('submitName', name)"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Danger Zone
  text: Be cautious when making changes in this section. You can archive your workspace or change its URL, which might break existing integrations and cause issues with the services that depend on it.{newline}For ways to mitigate these issues, please refer to the {guide} for more information and best-practices.
  text.guide: guide
  action.rename.title: Rename Workspace
  action.rename.text: Warning - URL changes may break existing integrations.
  action.rename.label: Rename
  action.archive.title: Archive Workspace
  action.archive.text: Makes workspace read-only and hides it from active workspaces.
  action.archive.label: Archive
fr:
  title: Zone de danger
  text: Soyez prudent lorsque vous apportez des modifications dans cette section. Vous pouvez archiver votre espace de travail ou modifier son URL, ce qui pourrait rompre les intégrations existantes et causer des problèmes avec les services qui en dépendent.{newline}Pour des moyens d'atténuer ces problèmes, veuillez vous référer au {guide} pour plus d'informations et de bonnes pratiques.
  text.guide: guide
  action.rename.title: Renommer l'espace de travail
  action.rename.text: Attention - Les modifications d'URL peuvent briser les intégrations.
  action.rename.label: Renommer
  action.archive.title: Archiver l'espace de travail
  action.archive.text: Rend l'espace de travail en lecture seule et le masque.
  action.archive.label: Archiver
de:
  title: Gefahrenzone
  text: Seien Sie vorsichtig, wenn Sie Änderungen in diesem Abschnitt vornehmen. Sie können Ihren Arbeitsbereich archivieren oder dessen URL ändern, was bestehende Integrationen unterbrechen und Probleme mit abhängigen Diensten verursachen kann.{newline}Für Möglichkeiten, diese Probleme zu mildern, verweisen Sie bitte auf den {guide} für weitere Informationen und bewährte Verfahren.
  text.guide: leitfaden
  action.rename.title: Arbeitsbereich umbenennen
  action.rename.text: Warnung - URL-Änderungen können Integrationen beeinträchtigen.
  action.rename.label: Umbenennen
  action.archive.title: Arbeitsbereich archivieren
  action.archive.text: Macht den Arbeitsbereich schreibgeschützt und blendet ihn aus.
  action.archive.label: Archivieren
es:
  title: Zona de peligro
  text: Tenga cuidado al realizar cambios en esta sección. Puede archivar su espacio de trabajo o cambiar su URL, lo que podría romper las integraciones existentes y causar problemas con los servicios que dependen de él.{newline}Para formas de mitigar estos problemas, consulte la {guide} para obtener más información y mejores prácticas.
  text.guide: guía
  action.rename.title: Renombrar espacio de trabajo
  action.rename.text: Advertencia - Los cambios de URL pueden romper integraciones.
  action.rename.label: Renombrar
  action.archive.title: Archivar espacio de trabajo
  action.archive.text: Hace que el espacio sea de solo lectura y lo oculta.
  action.archive.label: Archivar
zh:
  title: 危险区
  text: 在此部分进行更改时要小心。您可以归档工作区或更改其 URL，这可能会破坏现有集成并导致依赖于它的服务出现问题。{newline}有关缓解这些问题的方法，请参阅{guide}以获取更多信息和最佳实践。
  text.guide: 指南
  action.rename.title: 重命名工作区
  action.rename.text: 警告 - URL更改可能会破坏现有集成。
  action.rename.label: 重命名
  action.archive.title: 归档工作区
  action.archive.text: 使工作区变为只读并将其隐藏。
  action.archive.label: 归档
</i18n>
