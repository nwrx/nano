<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettings',
  path: '/:workspace/settings',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  icon: 'i-carbon:settings',
  title: {
    en: 'Workspace settings',
    fr: 'Paramètres de l\'espace',
    de: 'Arbeitsbereich-Einstellungen',
    es: 'Configuración del espacio',
    zh: '工作区设置',
  },
  description: {
    en: 'Manage your workspace settings and configurations.',
    fr: 'Gérez les paramètres et configurations de votre espace.',
    de: 'Verwalten Sie Ihre Arbeitsbereich-Einstellungen und Konfigurationen.',
    es: 'Administre la configuración de su espacio de trabajo.',
    zh: '管理您的工作区设置和配置。',
  },
})

// --- Route and i18n.
const { t } = useI18n()
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const url = computed(() => `${CONSTANTS.appHost}/`)

// --- Data and actions.
const { data, getWorkspace, rename, archive } = useWorkspace(workspace)
onMounted(getWorkspace)
</script>

<template>
  <AppPageContainer contained>
    <!-- General Settings -->
    <AppPageForm
      :title="localize(route.meta.title)"
      :text="localize(route.meta.description)">
      <InputText
        disabled
        :model-value="workspace"
        :text-before="url"
        :hint="t('general.name.hint')"
      />
    </AppPageForm>

    <!-- Danger Zone -->
    <Trigger v-slot="trigger" :keys="['rename', 'archive']">
      <AppPageForm :title="t('dangerZone.title')" :text="t('dangerZone.text')">
        <AppPageFormActions class="border-danger">
          <AppPageFormAction
            class="border-danger"
            class-button="button-danger"
            icon="i-carbon:archive"
            :title="t('dangerZone.archive.title')"
            :text="t('dangerZone.archive.text')"
            :label="t('dangerZone.archive.label')"
            @click="() => trigger.open('archive')"
          />
          <AppPageFormAction
            class="border-danger"
            class-button="button-danger"
            icon="i-carbon:edit"
            :title="t('dangerZone.rename.title')"
            :text="t('dangerZone.rename.text')"
            :label="t('dangerZone.rename.label')"
            @click="() => trigger.open('rename')"
          />
        </AppPageFormActions>
      </AppPageForm>

      <!-- Rename workspace dialog -->
      <Ephemeral v-slot="{ value }" :initial-value="{ name: '' }">
        <Dialog
          v-model="trigger.value.rename"
          icon="i-carbon:label"
          class-hint="hint-warning"
          class-button="button-warning"
          :title="t('rename.title', { workspace })"
          :text="t('rename.text', { workspace })"
          :label-cancel="t('rename.cancel')"
          :label-confirm="t('rename.confirm')"
          @open="() => value.name = data.name || ''"
          @confirm="() => rename(value.name)">
          <InputText
            v-model="value.name"
            class="mt-2"
            :text-before="`${CONSTANTS.appHost}/`"
            :placeholder="t('rename.label')"
          />
        </Dialog>
      </Ephemeral>

      <!-- Archive workspace dialog -->
      <Ephemeral v-slot="{ value }" :initial-value="{ name: '' }">
        <Dialog
          v-model="trigger.value.archive"
          icon="i-carbon:archive"
          class-hint="hint-warning"
          class-button="button-warning"
          :title="t('archive.title', { workspace })"
          :text="t('archive.text', { workspace })"
          :label-cancel="t('archive.cancel')"
          :label-confirm="t('archive.confirm')"
          :disabled="value.name !== workspace"
          @open="() => value.name = ''"
          @confirm="() => archive()">
          <InputText
            v-model="value.name"
            :label="t('archive.label')"
            :placeholder="workspace"
          />
        </Dialog>
      </Ephemeral>
    </Trigger>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  general:
    name:
      hint: The workspace name is part of your workspace's URL and cannot be changed here.
  dangerZone:
    title: Danger zone
    text: Proceed with caution. Actions here can permanently affect your workspace and its integrations.
    rename:
      title: Rename workspace
      text: Renaming your workspace will update its URL. Existing integrations and bookmarks may break. Proceed carefully.
      label: Rename
    archive:
      title: Archive workspace
      text: Archiving makes your workspace read-only and hides it from active workspaces. All existing integrations will still work.
      label: Archive
  rename:
    title: Rename workspace **{workspace}**
    text: Renaming your workspace will update its URL and may break existing integrations. Ensure you communicate this change to your team and update any dependent services.
    cancel: Cancel
    confirm: Rename
    label: Enter new workspace name
  archive:
    title: Archive workspace **{workspace}**
    text: The workspace will become read-only and will be hidden from active workspaces. All existing integrations will continue to work, but no new changes can be made.
    cancel: Cancel
    confirm: Archive
    label: Type the workspace name to confirm
fr:
  general:
    name:
      hint: Le nom de l'espace fait partie de l'URL de votre espace et ne peut pas être modifié ici.
  dangerZone:
    title: Zone dangereuse
    text: Procédez avec prudence. Les actions ici peuvent affecter définitivement votre espace de travail et ses intégrations.
    rename:
      title: Renommer l'espace
      text: Renommer votre espace mettra à jour son URL. Les intégrations et favoris existants pourraient être rompus. Procédez avec précaution.
      label: Renommer
    archive:
      title: Archiver l'espace
      text: L'archivage rend votre espace en lecture seule et le masque des espaces actifs. Toutes les intégrations existantes continueront de fonctionner.
      label: Archiver
  rename:
    title: Renommer l'espace **{workspace}**
    text: Le renommage de votre espace mettra à jour son URL et pourrait rompre les intégrations existantes. Assurez-vous de communiquer ce changement à votre équipe et de mettre à jour tous les services dépendants.
    cancel: Annuler
    confirm: Renommer
    label: Entrez le nouveau nom de l'espace
  archive:
    title: Archiver l'espace **{workspace}**
    text: L'espace deviendra en lecture seule et sera masqué des espaces actifs. Toutes les intégrations existantes continueront de fonctionner, mais aucune nouvelle modification ne pourra être effectuée.
    cancel: Annuler
    confirm: Archiver
    label: Tapez le nom de l'espace pour confirmer
de:
  general:
    name:
      hint: Der Arbeitsbereichsname ist Teil der URL Ihres Arbeitsbereichs und kann hier nicht geändert werden.
  dangerZone:
    title: Gefahrenzone
    text: Vorsicht! Aktionen hier können Ihren Arbeitsbereich und dessen Integrationen dauerhaft beeinflussen.
    rename:
      title: Arbeitsbereich umbenennen
      text: Das Umbenennen Ihres Arbeitsbereichs aktualisiert dessen URL. Bestehende Integrationen und Lesezeichen könnten beschädigt werden. Gehen Sie vorsichtig vor.
      label: Umbenennen
    archive:
      title: Arbeitsbereich archivieren
      text: Archivierung macht Ihren Arbeitsbereich schreibgeschützt und blendet ihn aus aktiven Arbeitsbereichen aus. Alle bestehenden Integrationen funktionieren weiterhin.
      label: Archivieren
  rename:
    title: Arbeitsbereich **{workspace}** umbenennen
    text: Das Umbenennen Ihres Arbeitsbereichs aktualisiert dessen URL und könnte bestehende Integrationen beschädigen. Informieren Sie Ihr Team und aktualisieren Sie abhängige Dienste.
    cancel: Abbrechen
    confirm: Umbenennen
    label: Neuen Arbeitsbereichsnamen eingeben
  archive:
    title: Arbeitsbereich **{workspace}** archivieren
    text: Der Arbeitsbereich wird schreibgeschützt und aus aktiven Arbeitsbereichen ausgeblendet. Alle bestehenden Integrationen funktionieren weiterhin, aber es können keine neuen Änderungen vorgenommen werden.
    cancel: Abbrechen
    confirm: Archivieren
    label: Geben Sie den Arbeitsbereichsnamen zur Bestätigung ein
es:
  general:
    name:
      hint: El nombre del espacio de trabajo forma parte de la URL de su espacio de trabajo y no se puede cambiar aquí.
  dangerZone:
    title: Zona peligrosa
    text: Proceda con precaución. Las acciones aquí pueden afectar permanentemente su espacio de trabajo y sus integraciones.
    rename:
      title: Renombrar espacio
      text: Renombrar su espacio actualizará su URL. Las integraciones y marcadores existentes podrían romperse. Proceda con cuidado.
      label: Renombrar
    archive:
      title: Archivar espacio
      text: Archivar hace que su espacio sea de solo lectura y lo oculta de los espacios activos. Todas las integraciones existentes seguirán funcionando.
      label: Archivar
  rename:
    title: Renombrar espacio **{workspace}**
    text: Renombrar su espacio actualizará su URL y podría romper integraciones existentes. Asegúrese de comunicar este cambio a su equipo y actualizar cualquier servicio dependiente.
    cancel: Cancelar
    confirm: Renombrar
    label: Ingrese nuevo nombre de espacio
  archive:
    title: Archivar espacio **{workspace}**
    text: El espacio se convertirá en solo lectura y se ocultará de los espacios activos. Todas las integraciones existentes seguirán funcionando, pero no se podrán realizar nuevos cambios.
    cancel: Cancelar
    confirm: Archivar
    label: Escriba el nombre del espacio para confirmar
zh:
  general:
    name:
      hint: 工作区名称是工作区 URL 的一部分，无法在此处更改。
  dangerZone:
    title: 危险区
    text: 谨慎操作。此处的操作可能会永久影响您的工作区及其集成。
    rename:
      title: 重命名工作区
      text: 重命名工作区将更新其 URL。现有的集成和书签可能会中断。请谨慎操作。
      label: 重命名
    archive:
      title: 归档工作区
      text: 归档会使您的工作区变为只读并将其从活动工作区中隐藏。所有现有集成将继续工作。
      label: 归档
  rename:
    title: 重命名工作区 **{workspace}**
    text: 重命名工作区将更新其 URL，可能会中断现有集成。确保您向团队通报此更改，并更新任何依赖服务。
    cancel: 取消
    confirm: 重命名
    label: 输入新工作区名称
  archive:
    title: 归档工作区 **{workspace}**
    text: 工作区将变为只读，并将从活动工作区中隐藏。所有现有集成将继续工作，但无法进行新的更改。
    cancel: 取消
    confirm: 归档
    label: 输入工作区名称以确认
</i18n>
