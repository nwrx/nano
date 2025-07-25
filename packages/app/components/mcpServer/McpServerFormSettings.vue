<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { McpServerObject } from '@nwrx/nano-api'
import AppPageForm from '~/components/app/AppPageForm.vue'
import { useMcpServer } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

// --- State.
const { t } = useI18n()
const formData = ref({} as McpServerObject)
const server = useMcpServer(props)
onMounted(() => void server.fetchServer())

// --- Lifecycle.
watch(
  () => server.data,
  serverData => formData.value = serverData,
  { immediate: true },
)
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('description')"
    :label="t('submitLabel')"
    @submit="() => server.updateServer({
      title: formData.title,
      description: formData.description,
    })">

    <!-- Name -->
    <InputText
      :model-value="server.data.name"
      class="md:col-span-2"
      :label="t('nameHint')"
      :placeholder="t('namePlaceholder')"
      :text-before="`${CONSTANTS.appHost}/${workspace}/pools/${pool}/servers/`"
      disabled
    />

    <!-- Title -->
    <InputText
      v-model="formData.title"
      :label="t('titleHint')"
      :placeholder="t('titlePlaceholder')"
    />

    <!-- Description -->
    <InputText
      v-model="formData.description"
      :label="t('descriptionHint')"
      :placeholder="t('descriptionPlaceholder')"
      type="textarea"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Server Settings
  description: Update the settings for the server in the pool
  submitLabel: Update Server Settings
  nameHint: Unique identifier for the server within the pool
  namePlaceholder: weather-service-server
  titleHint: Display name for the server
  titlePlaceholder: Weather Service
  descriptionHint: Brief description of the server's functionality
  descriptionPlaceholder: A service that provides weather information and forecasts
fr:
  submitLabel: Mettre à jour les paramètres du serveur
  nameHint: Identifiant unique du serveur dans le pool
  namePlaceholder: serveur-service-meteo
  titleHint: Nom d'affichage du serveur
  titlePlaceholder: Service Météo
  descriptionHint: Brève description de la fonctionnalité du serveur
  descriptionPlaceholder: Un service qui fournit des informations et prévisions météorologiques
de:
  submitLabel: Server-Einstellungen aktualisieren
  nameHint: Eindeutige Kennung des Servers im Pool
  namePlaceholder: wetterdienst-server
  titleHint: Anzeigename des Servers
  titlePlaceholder: Wetterdienst
  descriptionHint: Kurze Beschreibung der Server-Funktionalität
  descriptionPlaceholder: Ein Dienst, der Wetterinformationen und -vorhersagen bereitstellt
  successUpate: Server-Einstellungen erfolgreich aktualisiert
es:
  submitLabel: Actualizar configuración del servidor
  nameHint: Identificador único del servidor en el pool
  namePlaceholder: servidor-servicio-meteorologico
  titleHint: Nombre de visualización del servidor
  titlePlaceholder: Servicio Meteorológico
  descriptionHint: Breve descripción de la funcionalidad del servidor
  descriptionPlaceholder: Un servicio que proporciona información y pronósticos meteorológicos
zh:
  submitLabel: 更新服务器设置
  nameHint: 池中服务器的唯一标识符
  namePlaceholder: 天气服务服务器
  titleHint: 服务器显示名称
  titlePlaceholder: 天气服务
  descriptionHint: 服务器功能的简要描述
  descriptionPlaceholder: 提供天气信息和预报的服务
</i18n>
