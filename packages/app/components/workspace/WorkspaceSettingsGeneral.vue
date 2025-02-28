<script setup lang="ts">
defineProps<{ workspace: string }>()

const { t } = useI18n()
const url = computed(() => `${CONSTANTS.appHost}/`)
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <InputText
      disabled
      :model-value="workspace"
      :text-before="url"
      :hint="t('name.hint')"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: General Settings
  text: This is your workspace's unique identifier used in URLs and API calls.
  name.hint: This identifier cannot be changed in general settings.
fr:
  title: Paramètres généraux
  text: Il s'agit de l'identifiant unique de votre espace de travail utilisé dans les URLs et les appels API.
  name.hint: Cet identifiant ne peut pas être modifié dans les paramètres généraux.
de:
  title: Allgemeine Einstellungen
  text: Dies ist die eindeutige Kennung Ihres Arbeitsbereichs, die in URLs und API-Aufrufen verwendet wird.
  name.hint: Diese Kennung kann in den allgemeinen Einstellungen nicht geändert werden.
es:
  title: Configuración general
  text: Este es el identificador único de su espacio de trabajo utilizado en URLs y llamadas API.
  name.hint: Este identificador no se puede cambiar en la configuración general.
zh:
  title: 通用设置
  text: 这是您的工作区的唯一标识符，用于 URL 和 API 调用。
  name.hint: 此标识符无法在常规设置中更改。如需重命名工作区，请使用危险区。
</i18n>
