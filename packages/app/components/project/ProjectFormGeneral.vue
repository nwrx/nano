<script setup lang="ts">
import AppPageForm from '~/components/app/AppPageForm.vue'
import { useProject } from '~/composables/useProject'

const props = defineProps<{
  workspace: string
  project: string
}>()

const { t } = useI18n()
const project = useProject(props)
onMounted(() => {
  void project.fetchProject()
  void project.subscribeToEvents()
})
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('description')"
    :label="t('submitLabel')"
    @submit="() => project.updateProject(project.data)">

    <InputText
      disabled
      :model-value="props.project"
      :text-before="`${CONSTANTS.appHost}/${workspace}/`"
      :hint="t('nameHint')"
    />
    <InputText
      v-model="project.data.title"
      icon="i-carbon:label"
      :label="t('titleLabel')"
      :placeholder="t('titlePlaceholder')"
    />
    <InputText
      v-model="project.data.description"
      :placeholder="t('descriptionPlaceholder')"
      type="textarea"
      class-input="!h-32"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: General Settings
  description: Configure your project's core information, visibility, and team collaboration settings. These changes affect how your project appears to collaborators and integrates with external services.
  submitLabel: Save Changes
  successMessage: Project **{workspace}/{project}** settings updated successfully!
  nameHint: The project identifier is part of your URL and cannot be changed after creation for security reasons.
  titleLabel: Display Name
  titlePlaceholder: How should your project appear to users?
  descriptionPlaceholder: Describe your project's purpose, goals, and key features...
fr:
  title: Paramètres Généraux
  description: Configurez les informations principales de votre projet, la visibilité et les paramètres de collaboration d'équipe. Ces modifications affectent l'apparence de votre projet aux collaborateurs.
  submitLabel: Enregistrer
  successMessage: Paramètres du projet **{workspace}/{project}** mis à jour avec succès !
  nameHint: L'identifiant de projet fait partie de votre URL et ne peut pas être modifié après création pour des raisons de sécurité.
  titleLabel: Nom d'affichage
  titlePlaceholder: Comment votre projet doit-il apparaître aux utilisateurs ?
  descriptionPlaceholder: Décrivez l'objectif, les buts et les fonctionnalités clés de votre projet...
de:
  title: Allgemeine Einstellungen
  description: Konfigurieren Sie die Kerninformationen Ihres Projekts, Sichtbarkeit und Team-Kollaborationseinstellungen. Diese Änderungen beeinflussen, wie Ihr Projekt Mitarbeitern erscheint.
  submitLabel: Speichern
  successMessage: Projekteinstellungen **{workspace}/{project}** erfolgreich aktualisiert!
  nameHint: Die Projektkennung ist Teil Ihrer URL und kann nach der Erstellung aus Sicherheitsgründen nicht geändert werden.
  titleLabel: Anzeigename
  titlePlaceholder: Wie soll Ihr Projekt Benutzern erscheinen?
  descriptionPlaceholder: Beschreiben Sie den Zweck, die Ziele und wichtigsten Funktionen Ihres Projekts...
es:
  title: Configuración General
  description: Configure la información principal de su proyecto, visibilidad y configuraciones de colaboración del equipo. Estos cambios afectan cómo aparece su proyecto a los colaboradores.
  submitLabel: Guardar
  successMessage: ¡Configuración del proyecto **{workspace}/{project}** actualizada exitosamente!
  nameHint: El identificador del proyecto es parte de su URL y no puede cambiarse después de la creación por razones de seguridad.
  titleLabel: Nombre visible
  titlePlaceholder: ¿Cómo debería aparecer su proyecto a los usuarios?
  descriptionPlaceholder: Describa el propósito, objetivos y características clave de su proyecto...
zh:
  title: 常规设置
  description: 配置项目的核心信息、可见性和团队协作设置。这些更改会影响项目对协作者的显示方式。
  submitLabel: 保存
  successMessage: 项目 **{workspace}/{project}** 设置更新成功！
  nameHint: 项目标识符是URL的一部分，出于安全原因，创建后无法更改。
  titleLabel: 显示名称
  titlePlaceholder: 您的项目应该如何向用户显示？
  descriptionPlaceholder: 描述您的项目目的、目标和主要功能...
</i18n>
