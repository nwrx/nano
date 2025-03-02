<script setup lang="ts">
definePageMeta({
  name: 'ProjectSettings',
  path: '/:workspace/:project/settings',
  middleware: 'redirect-when-guest',
  layout: 'project-settings',
  icon: 'i-carbon:settings',
  title: {
    en: 'Project settings',
    fr: 'Paramètres du projet',
    de: 'Projekteinstellungen',
    es: 'Configuración del proyecto',
    zh: '项目设置',
  },
  description: {
    en: 'Update your project settings, manage integrations, and configure your project to meet your team\'s needs.',
    fr: 'Mettez à jour les paramètres de votre projet, gérez les intégrations et configurez votre projet pour répondre aux besoins de votre équipe.',
    de: 'Aktualisieren Sie Ihre Projekteinstellungen, verwalten Sie Integrationen und konfigurieren Sie Ihr Projekt, um den Anforderungen Ihres Teams gerecht zu werden.',
    es: 'Actualice la configuración de su proyecto, administre las integraciones y configure su proyecto para satisfacer las necesidades de su equipo.',
    zh: '更新您的项目设置，管理集成，并配置您的项目以满足团队的需求。',
  },
})

// --- Route.
const { t } = useI18n()
const route = useRoute()
const project = computed(() => route.params.project as string)
const workspace = computed(() => route.params.workspace as string)

// --- Data.
const { data, getProject, update, rename, remove } = useProject(workspace, project)
onMounted(getProject)
</script>

<template>
  <AppPageContainer contained>

    <!-- General Settings -->
    <AppPageForm
      :title="localize(route.meta.title)"
      :text="localize(route.meta.description)"
      :label="t('general.form.submit')"
      @submit="() => update(data)">
      <InputText
        v-model="data.title"
        icon="i-carbon:label"
        :placeholder="t('general.title.placeholder')"
      />
      <InputText
        disabled
        :model-value="project"
        :text-before="`${CONSTANTS.appHost}/${workspace}/`"
        :hint="t('general.name.hint')"
      />
      <InputText
        v-model="data.description"
        :placeholder="t('general.description.placeholder')"
        type="textarea"
        class-input="!h-32"
      />
    </AppPageForm>

    <!-- Danger Zone -->
    <Trigger v-slot="trigger" :keys="['rename', 'transfer', 'delete']">
      <AppPageForm :title="t('dangerZone.title')" :text="t('dangerZone.text')">
        <AppPageFormActions class="border-danger">
          <AppPageFormAction
            class="border-danger"
            class-button="button-danger"
            icon="i-carbon:edit"
            :title="t('dangerZone.rename.title')"
            :text="t('dangerZone.rename.text')"
            :label="t('dangerZone.rename.label')"
            @click="() => trigger.open('rename')"
          />
          <AppPageFormAction
            class="border-danger"
            class-button="button-danger"
            icon="i-carbon:status-change"
            :title="t('dangerZone.transfer.title')"
            :text="t('dangerZone.transfer.text')"
            :label="t('dangerZone.transfer.label')"
            @click="() => trigger.open('transfer')"
          />
          <AppPageFormAction
            class="border-danger"
            class-button="button-danger"
            icon="i-carbon:trash-can"
            :title="t('dangerZone.delete.title')"
            :text="t('dangerZone.delete.text')"
            :label="t('dangerZone.delete.label')"
            @click="() => trigger.open('delete')"
          />
        </AppPageFormActions>
      </AppPageForm>

      <!-- Rename project dialog - Simple Text input to rename the project -->
      <Ephemeral v-slot="{ value }" :initial-value="data">
        <Dialog
          v-model="trigger.value.rename"
          icon="i-carbon:label"
          class-hint="hint-warning"
          class-button="button-warning"
          :title="t('rename.title', { workspace, project })"
          :text="t('rename.text', { workspace, project })"
          :label-cancel="t('rename.cancel')"
          :label-confirm="t('rename.confirm')"
          @open="() => value.name = data.name"
          @confirm="() => rename(value.name)">
          <InputText
            v-model="value.name"
            class="mt-2"
            :text-before="`api.nwrx.io/${workspace}/`"
            :placeholder="t('rename.label')"
          />
        </Dialog>
      </Ephemeral>

      <!-- Transfer project dialog - Search for a user to transfer the project to -->
      <Ephemeral v-slot="{ value }" :initial-value="{ usernames: [] as string[] }">
        <Dialog
          v-model="trigger.value.transfer"
          icon="i-carbon:status-change"
          class-hint="hint-warning"
          class-button="button-warning"
          :title="t('transfer.title', { workspace, project })"
          :text="t('transfer.text', { workspace, project })"
          :label-cancel="t('transfer.cancel')"
          :label-confirm="t('transfer.confirm')"
          @open="() => value.usernames = []"
          @confirm="() => console.log('Transfer project')">
          <UserSearch
            v-model="value.usernames"
            class="mt-2"
            :placeholder="t('transfer.label')"
          />
        </Dialog>
      </Ephemeral>

      <!-- Delete project dialog - Confirm the deletion of the project by typing the {workspace}/{project} name -->
      <Ephemeral v-slot="{ value }" :initial-value="{ name: '' }">
        <Dialog
          v-model="trigger.value.delete"
          icon="i-carbon:trash-can"
          class-hint="hint-danger"
          class-button="button-danger"
          :title="t('delete.title', { workspace, project })"
          :text="t('delete.text', { workspace, project })"
          :label-cancel="t('delete.cancel')"
          :label-confirm="t('delete.confirm')"
          :disabled="value.name !== project"
          @open="() => value.name = ''"
          @confirm="() => remove()">
          <InputText
            v-model="value.name"
            :text-before="`api.nwrx.io/${workspace}/`"
            :placeholder="t('delete.label')"
          />
        </Dialog>
      </Ephemeral>
    </Trigger>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  general:
    form:
      submit: Save changes
    title:
      placeholder: Enter your project title
    name:
      hint: The project name is part of your project's URL and cannot be changed here.
    description:
      placeholder: Provide a brief description of your project (optional).
  dangerZone:
    title: Danger zone
    text: Proceed with caution. Actions here can permanently affect your project and its integrations.
    rename:
      title: Rename project
      text: Renaming your project will update its URL. Existing integrations and bookmarks may break. Proceed carefully.
      label: Rename
    transfer:
      title: Transfer ownership
      text: Transfer this project to another workspace or user. Ensure the new owner is aware of this change.
      label: Transfer
    delete:
      title: Permanently delete project
      text: This action is **irreversible**. All project data will be permanently lost.
      label: Delete
  rename:
    title: Rename project **{workspace}/{project}**
    text: Renaming your project will update its URL and may break existing integrations. Ensure you communicate this change to your team and update any dependent services.
    cancel: Cancel
    confirm: Rename
    label: Enter new project name
  delete:
    title: Confirm deletion of **{workspace}/{project}**
    text: This action **cannot be undone**. To confirm deletion, please type the exact project path below.
    cancel: Cancel
    confirm: Delete
    label: Confirm deletion by typing the name of the project
  transfer:
    title: Transfer project **{workspace}/{project}**
    text: Transferring ownership will move the project to another workspace. Ensure the new owner is prepared for this change.
    cancel: Cancel
    confirm: Transfer
    label: Search and select new owner
fr:
  general:
    form:
      title: Paramètres généraux
      text: Mettez à jour le titre et la description de votre projet pour communiquer clairement son objectif à votre équipe et à vos collaborateurs.
      submit: Enregistrer les modifications
    title:
      placeholder: Entrez le titre de votre projet
    name:
      hint: Le nom du projet fait partie de l'URL de votre projet et ne peut pas être modifié ici.
    description:
      placeholder: Fournissez une brève description de votre projet (facultatif).
  dangerZone:
    title: Zone dangereuse
    text: Procédez avec prudence. Les actions ici peuvent affecter définitivement votre projet et ses intégrations.
    rename:
      title: Renommer le projet
      text: Renommer votre projet mettra à jour son URL. Les intégrations et favoris existants pourraient être rompus. Procédez avec précaution.
      label: Renommer
    transfer:
      title: Transférer la propriété
      text: Transférez ce projet à un autre espace de travail ou utilisateur. Assurez-vous que le nouveau propriétaire est informé de ce changement.
      label: Transférer
    delete:
      title: Supprimer définitivement le projet
      text: Cette action est **irréversible**. Toutes les données du projet seront définitivement perdues.
      label: Supprimer
  rename:
    title: Renommer le projet **{workspace}/{project}**
    text: Renommer votre projet mettra à jour son URL et pourrait rompre les intégrations existantes. Assurez-vous de communiquer ce changement à votre équipe et de mettre à jour tous les services dépendants.
    cancel: Annuler
    confirm: Renommer
    label: Entrez le nouveau nom du projet
  delete:
    title: Confirmer la suppression de **{workspace}/{project}**
    text: Cette action est **irréversible**. Pour confirmer la suppression, veuillez saisir le chemin exact du projet ci-dessous.
    cancel: Annuler
    confirm: Supprimer
    label: Confirmez la suppression en saisissant le nom du projet
  transfer:
    title: Transférer le projet **{workspace}/{project}**
    text: Le transfert de propriété déplacera le projet vers un autre espace de travail. Assurez-vous que le nouveau propriétaire est prêt pour ce changement.
    cancel: Annuler
    confirm: Transférer
    label: Rechercher et sélectionner le nouveau propriétaire
de:
  general:
    form:
      title: Allgemeine Einstellungen
      text: Aktualisieren Sie den Titel und die Beschreibung Ihres Projekts, um dessen Zweck Ihrem Team und Ihren Mitarbeitern klar zu kommunizieren.
      submit: Änderungen speichern
    title:
      placeholder: Geben Sie den Projekttitel ein
    name:
      hint: Der Projektname ist Teil der Projekt-URL und kann hier nicht geändert werden.
    description:
      placeholder: Geben Sie eine kurze Beschreibung Ihres Projekts ein (optional).
  dangerZone:
    title: Gefahrenzone
    text: Vorsicht! Aktionen hier können Ihr Projekt und dessen Integrationen dauerhaft beeinflussen.
    rename:
      title: Projekt umbenennen
      text: Das Umbenennen Ihres Projekts aktualisiert dessen URL. Bestehende Integrationen und Lesezeichen könnten beschädigt werden. Gehen Sie vorsichtig vor.
      label: Umbenennen
    transfer:
      title: Eigentümerschaft übertragen
      text: Übertragen Sie dieses Projekt an einen anderen Arbeitsbereich oder Benutzer. Stellen Sie sicher, dass der neue Eigentümer über diese Änderung informiert ist.
      label: Übertragen
    delete:
      title: Projekt dauerhaft löschen
      text: Diese Aktion ist **unumkehrbar**. Alle Projektdaten gehen dauerhaft verloren.
      label: Löschen
  rename:
    title: Projekt **{workspace}/{project}** umbenennen
    text: Das Umbenennen Ihres Projekts aktualisiert dessen URL und könnte bestehende Integrationen beschädigen. Informieren Sie Ihr Team und aktualisieren Sie abhängige Dienste.
    cancel: Abbrechen
    confirm: Umbenennen
    label: Neuen Projektnamen eingeben
  delete:
    title: Löschung von **{workspace}/{project}** bestätigen
    text: Diese Aktion kann **nicht rückgängig gemacht werden**. Geben Sie zur Bestätigung den genauen Projektpfad unten ein.
    cancel: Abbrechen
    confirm: Löschen
    label: Bestätigen Sie die Löschung durch Eingabe des Projektnamens
  transfer:
    title: Projekt **{workspace}/{project}** übertragen
    text: Die Eigentumsübertragung verschiebt das Projekt in einen anderen Arbeitsbereich. Stellen Sie sicher, dass der neue Eigentümer auf diese Änderung vorbereitet ist.
    cancel: Abbrechen
    confirm: Übertragen
    label: Neuen Eigentümer suchen und auswählen
es:
  general:
    form:
      title: Configuración general
      text: Actualiza el título y la descripción de tu proyecto para comunicar claramente su propósito a tu equipo y colaboradores.
      submit: Guardar cambios
    title:
      placeholder: Ingresa el título de tu proyecto
    name:
      hint: El nombre del proyecto forma parte de la URL del proyecto y no se puede cambiar aquí.
    description:
      placeholder: Proporciona una breve descripción de tu proyecto (opcional).
  dangerZone:
    title: Zona peligrosa
    text: Procede con precaución. Las acciones aquí pueden afectar permanentemente tu proyecto y sus integraciones.
    rename:
      title: Renombrar proyecto
      text: Renombrar tu proyecto actualizará su URL. Las integraciones y marcadores existentes podrían romperse. Procede con cuidado.
      label: Renombrar
    transfer:
      title: Transferir propiedad
      text: Transfiere este proyecto a otro espacio de trabajo o usuario. Asegúrate de que el nuevo propietario esté informado de este cambio.
      label: Transferir
    delete:
      title: Eliminar proyecto permanentemente
      text: Esta acción es **irreversible**. Todos los datos del proyecto se perderán permanentemente.
      label: Eliminar
  rename:
    title: Renombrar proyecto **{workspace}/{project}**
    text: Renombrar tu proyecto actualizará su URL y podría romper integraciones existentes. Asegúrate de comunicar este cambio a tu equipo y actualizar cualquier servicio dependiente.
    cancel: Cancelar
    confirm: Renombrar
    label: Ingresa el nuevo nombre del proyecto
  delete:
    title: Confirmar eliminación de **{workspace}/{project}**
    text: Esta acción **no se puede deshacer**. Para confirmar la eliminación, escribe la ruta exacta del proyecto abajo.
    cancel: Cancelar
    confirm: Eliminar
    label: Confirma la eliminación escribiendo el nombre del proyecto
zh:
  general:
    form:
      title: 通用设置
      text: 更新项目的标题和描述，以清楚地传达其目的给您的团队和合作者。
      submit: 保存更改
    title:
      placeholder: 输入项目标题
    name:
      hint: 项目名称是项目的 URL 的一部分，无法在此处更改。
    description:
      placeholder: 提供项目的简要描述（可选）。
  dangerZone:
    title: 危险区
    text: 谨慎操作。此处的操作可能会永久影响您的项目及其集成。
    rename:
      title: 重命名项目
      text: 重命名项目将更新其 URL。现有的集成和书签可能会中断。请谨慎操作。
      label: 重命名
    transfer:
      title: 转移所有权
      text: 将此项目转移到另一个工作区或用户。确保新所有者知晓此更改。
      label: 转移
    delete:
      title: 永久删除项目
      text: 此操作是**不可逆转**的。所有项目数据将永久丢失。
      label: 删除
  rename:
    title: 重命名项目 **{workspace}/{project}**
    text: 重命名项目将更新其 URL，可能会中断现有集成。确保您向团队通报此更改，并更新任何依赖服务。
    cancel: 取消
    confirm: 重命名
    label: 输入新项目名称
  delete:
    title: 确认删除 **{workspace}/{project}**
    text: 此操作**无法撤销**。要确认删除，请在下方输入确切的项目路径。
    cancel: 取消
    confirm: 删除
    label: 通过输入项目名称确认删除
  transfer:
    title: 转移项目 **{workspace}/{project}**
    text: 转移所有权将将项目移至另一个工作区。确保新所有者已准备好此更改。
    cancel: 取消
    confirm: 转移
    label: 搜索并选择新所有者
</i18n>
