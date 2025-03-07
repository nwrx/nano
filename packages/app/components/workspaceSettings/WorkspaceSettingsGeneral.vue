<script setup lang="ts">
defineProps<{ workspace: string }>()
const { t } = useI18n()
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">
    <InputText
      disabled
      :model-value="workspace"
      :text-before="`${CONSTANTS.appHost}/`"
      :hint="t('hint')"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Workspace settings
  text: Manage your workspace settings and configurations.
  hint: The workspace name is part of your workspace's URL and cannot be changed here.
fr:
  title: Paramètres de l'espace de travail
  text: Gérez les paramètres et configurations de votre espace de travail.
  hint: Le nom de l'espace de travail fait partie de l'URL de votre espace de travail et ne peut pas être modifié ici.
de:
  title: Arbeitsbereichseinstellungen
  text: Verwalten Sie Ihre Arbeitsbereichseinstellungen und Konfigurationen.
  hint: Der Arbeitsbereichsname ist Teil der URL Ihres Arbeitsbereichs und kann hier nicht geändert werden.
es:
  title: Configuración del espacio de trabajo
  text: Administre la configuración de su espacio de trabajo y las configuraciones.
  hint: El nombre del espacio de trabajo es parte de la URL de su espacio de trabajo y no se puede cambiar aquí.
zh:
  title: 工作区设置
  text: 管理您的工作区设置和配置。
  hint: 工作区名称是您的工作区的 URL 的一部分，无法在此处更改。
</i18n>
